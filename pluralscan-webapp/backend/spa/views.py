from django.views.generic import TemplateView


class SpaView(TemplateView):
    template_name = "spa/index.html"
