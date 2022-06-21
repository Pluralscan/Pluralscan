import requests


class HttpUtils:
        @staticmethod
        def is_http_success(status_code: int) -> bool:
            cond1 = status_code >= 200
            cond2 = status_code <= 299
            return cond1 & cond2

        @staticmethod
        def url_is_accessible(url) -> bool:
            response = requests.get(url)
            return HttpUtils.is_http_success(response.status_code)