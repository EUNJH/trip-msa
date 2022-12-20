FROM openjdk:11
ADD /*.jar app.jar
COPY ./default.png /
COPY ./marker.png /
ENTRYPOINT ["java", "-jar", "app.jar"]