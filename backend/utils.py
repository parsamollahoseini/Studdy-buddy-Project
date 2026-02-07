import PyPDF2
from typing import Tuple


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
