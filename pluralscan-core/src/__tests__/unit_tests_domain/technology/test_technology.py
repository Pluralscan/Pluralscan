# import pytest
# from pluralscan.domain.technology.technology import Technology

# @pytest.mark.parametrize("language,expected", [
#     ("cobol", Technology.COBOL),
#     ("cObOl", Technology.COBOL),
# ])
# def test_new_from_string_value(language, expected):
#     technology = Technology(language)
#     assert technology == expected

# def test_on_new_raises_exception():
#     info = TechnologyInfo("test")
#     with pytest.raises(Exception):
#         Technology("test", info)

# def test_on_define_info_raises_exception():
#     langague = "cobol"
#     technology = Technology(langague)
#     with pytest.raises(Exception):
#         technology.info = TechnologyInfo("test")

# def test_get_info():
#     langague = "cobol"
#     technology = Technology(langague)
#     assert technology.info.name == "Cobol"