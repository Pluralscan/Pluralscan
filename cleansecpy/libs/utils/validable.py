from abc import ABCMeta


class Validable(metaclass=ABCMeta):
    def __post_init__(self):
        """Run validation methods if declared.
        The validation method can be a simple check
        that raises ValueError or a transformation to
        the field value.
        The validation is performed by calling a function named:
            `validate_<field_name>(self, value, field) -> field.type`
        You SHOULD omit the underscore for the field name.
        """
        for name, field in self.__dataclass_fields__.items():
            method_suffix = str(name).replace("_", "")
            if (method := getattr(self, f"validate_{method_suffix}", None)):
                setattr(self, name, method(getattr(self, name), field=field))