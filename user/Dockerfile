FROM openjdk:11
ADD build/libs/*.jar app.jar
COPY ./default.png /
ENTRYPOINT ["java", "-jar", "app.jar"]