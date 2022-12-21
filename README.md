# trip-msa

### 각 컨테이너 빌드

docker build -t bookmark ./bookmark  
docker build -t user ./user  
docker build -t nearspot ./nearspot  
docker build -t review ./review  
docker build -t place ./place

### 도커 컴포즈

docker-compose up --build -d
