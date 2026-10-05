from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated, IsAdminUser

from estudos.models import Estudos
from estudos.serializers import EstudosSerializer


class EstudosViewSet(viewsets.ModelViewSet):
    queryset = Estudos.objects.all()
    serializer_class = EstudosSerializer
    permission_classes = [IsAuthenticated]

    def get_permissions(self):
        if self.action in ["create", "update", "partial_update", "destroy"]:
            return [IsAuthenticated(), IsAdminUser()]

        return [IsAuthenticated()]