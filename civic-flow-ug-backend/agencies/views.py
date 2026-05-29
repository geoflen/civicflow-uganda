from rest_framework import permissions, viewsets

from .models import Agency
from .serializers import AgencySerializer


class AgencyViewSet(viewsets.ModelViewSet):
	queryset = Agency.objects.all()
	serializer_class = AgencySerializer
	permission_classes = [permissions.IsAuthenticated]
