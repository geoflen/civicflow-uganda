from rest_framework import permissions, viewsets

from .models import User
from .serializers import UserSerializer


class UserViewSet(viewsets.ModelViewSet):
	queryset = User.objects.select_related("agency").all()
	serializer_class = UserSerializer
	permission_classes = [permissions.IsAuthenticated]
