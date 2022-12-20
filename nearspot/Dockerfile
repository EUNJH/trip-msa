FROM openjdk:11
ADD build/libs/nearspot-0.0.1-SNAPSHOT.jar app.jar
COPY ./default.png /
COPY ./marker.png /
ENTRYPOINT ["java", "-jar", "app.jar"]