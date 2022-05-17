import random
import string
import uuid

class TestHelpers:
    
    @staticmethod
    def is_valid_uuid(value: str) -> bool:
        try:
            uuid.UUID(str(value))
            return True
        except ValueError:
            return False

    @staticmethod
    def random_letters(len: int = 10) -> str:
        letters = string.ascii_letters
        return ''.join(random.choice(letters) for i in range(len))

    @staticmethod
    def random_digits(len: int = 10) -> str:
        digits = string.digits
        return ''.join(random.choice(digits) for i in range(len))