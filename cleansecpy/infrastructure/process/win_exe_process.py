from cleansecpy.application.processor.process.process_runner import AbstractProcessRunner


class WinExeProcessRunner(AbstractProcessRunner):
    def execute(self) -> None | Exception:
        return super().execute()
