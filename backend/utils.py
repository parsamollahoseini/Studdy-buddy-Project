import PyPDF2
import re
from typing import Tuple, List


def extract_text_from_pdf(file_path: str) -> str:
    """
    Extract text from a PDF file using PyPDF2.

    Args:
        file_path: Path to the PDF file

    Returns:
        Extracted text as a string
    """
    text = ""
    try:
        with open(file_path, 'rb') as file:
            pdf_reader = PyPDF2.PdfReader(file)
            num_pages = len(pdf_reader.pages)

            for page_num in range(num_pages):
                page = pdf_reader.pages[page_num]
                text += page.extract_text() + "\n"

    except Exception as e:
        raise Exception(f"Error extracting PDF text: {str(e)}")

    return text.strip()


def extract_text_from_txt(file_path: str) -> str:
    """
    Extract text from a TXT file.

    Args:
        file_path: Path to the TXT file

    Returns:
        File contents as a string
    """
    try:
        with open(file_path, 'r', encoding='utf-8') as file:
            text = file.read()
        return text.strip()
    except Exception as e:
        raise Exception(f"Error reading TXT file: {str(e)}")


def determine_file_type(filename: str) -> Tuple[str, bool]:
    """
    Determine if a file is PDF or TXT.

    Args:
        filename: Name of the file

    Returns:
        Tuple of (file_type, is_valid)
    """
    lower_filename = filename.lower()

    if lower_filename.endswith('.pdf'):
        return ('pdf', True)
    elif lower_filename.endswith('.txt'):
        return ('txt', True)
    else:
        return ('unknown', False)


def _split_sentences(text: str) -> List[str]:
    raw = re.split(r'(?<=[.?!])\s+', text.strip())
    return [s.strip() for s in raw if len(s.strip()) >= 15]


DEFINITION_PATTERNS = [
    r'^(.+?)\s+is defined as\s+(.+)$',
    r'^(.+?)\s+is called\s+(.+)$',
    r'^(.+?)\s+refers to\s+(.+)$',
    r'^(.+?)\s+means\s+(.+)$',
    r'^(.+?)\s+are\s+(.+)$',
    r'^(.+?)\s+is\s+(.+)$',
]


def generate_flashcards(text: str) -> List[dict]:
    if not text or len(text.strip()) < 30:
        return [{"question": "What was in the uploaded document?",
                 "answer": text.strip() if text else "No text found"}]

    sentences = _split_sentences(text)
    flashcards = []
    used = set()

    # Pass 1: definition-based flashcards
    for sent in sentences:
        if len(flashcards) >= 10:
            break
        for pattern in DEFINITION_PATTERNS:
            m = re.match(pattern, sent, re.IGNORECASE)
            if m:
                term = m.group(1).strip().rstrip(',')
                definition = m.group(2).strip().rstrip('.')
                if len(term) < 3 or len(definition) < 10:
                    continue
                q = f"What is {term}?"
                if q not in used:
                    flashcards.append({"question": q, "answer": definition})
                    used.add(q)
                break

    # Pass 2: keyword / fill-in-the-blank for capitalized terms
    if len(flashcards) < 5:
        for sent in sentences:
            if len(flashcards) >= 10:
                break
            caps = re.findall(r'\b([A-Z][a-z]+(?:\s+[A-Z][a-z]+)+)\b', sent)
            for term in caps:
                blanked = sent.replace(term, "______", 1)
                q = f"Fill in the blank: {blanked}"
                if q not in used:
                    flashcards.append({"question": q, "answer": term})
                    used.add(q)
                    break

    # Pass 3: fallback — use informative sentences as "explain" cards
    if len(flashcards) < 3:
        for sent in sentences:
            if len(flashcards) >= 5:
                break
            words = sent.split()
            if len(words) >= 8:
                short = " ".join(words[:6]) + "..."
                q = f"What does this describe: \"{short}\""
                if q not in used:
                    flashcards.append({"question": q, "answer": sent.rstrip('.')})
                    used.add(q)

    return flashcards[:10]
