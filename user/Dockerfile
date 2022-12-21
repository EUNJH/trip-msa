FROM openjdk:11
ADD ./*.jar app.jar
COPY default.png /
ENTRYPOINT ["java", "-jar", "app.jar"]