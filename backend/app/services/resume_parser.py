from pypdf import PdfReader
from docx import Document


def extract_text_from_pdf(file_path):
    text = ""

    reader = PdfReader(file_path)
    for page in reader.pages:
        extracted = page.extract_text()

        if extracted:
            text += extracted
    
    return text


def extract_text_from_docx(file_path):

    text = ""

    document = Document(file_path)

    for para in document.paragraphs:
        text += para.text + "\n"
    
    return text
