# trip-msa

### 프로젝트

[컴응설a팀.pptx](https://github.com/EUNJH/trip-msa/files/10300106/a.pptx)
[컴응설a팀.pdf](https://github.com/EUNJH/trip-msa/files/10300108/a.pdf)

[a팀\_trip.pptx](https://github.com/EUNJH/trip-msa/files/10298801/a._trip.pptx)

### 어플리케이션 컨테이너 코드

[<컨테이너 코드>](https://github.com/EUNJH/trip-msa-code)

### 각 컨테이너 빌드

```
docker build -t mydb ./mydb
docker build -t prom ./prom
docker build -t bookmark ./bookmark
docker build -t user ./user
docker build -t nearspot ./nearspot
docker build -t review ./review
docker build -t place ./place
```

### 도커 컴포즈

```
docker-compose up --build -d
```

### 데이터베이스 Node Exporter 연동

```
docker exec -it db-mysql sh # 데이터베이스 컨테이너 접속
mysql -uroot -p # mysql 접속
1234 # password 입력

CREATE USER 'exporter'@'%' IDENTIFIED BY '1234'; # exporter 접속을 위한 user 생성
GRANT PROCESS, REPLICATION CLIENT, SELECT ON _._ TO 'exporter'@'%';
exit

cd root
./node_exporter # node exporter 실행
Ctrl P + Q # dettach
```

### Mysql Exporter 컨테이너 실행

```
docker run -d --name exporter -p 9104:9104 --network trip-msa_default --env DATA_SOURCE_NAME="exporter:1234@(db-mysql:3306)/" prom/mysqld-exporter:latest --collect.engine_tokudb_status --collect.global_status --collect.global_variables --collect.info_schema.clientstats --collect.info_schema.innodb_metrics --collect.info_schema.innodb_tablespaces --collect.info_schema.innodb_cmp --collect.info_schema.innodb_cmpmem --collect.info_schema.processlist --collect.info_schema.processlist.min_time=0 --collect.info_schema.query_response_time --collect.info_schema.replica_host --collect.info_schema.tables --collect.info_schema.tablestats --collect.info_schema.schemastats --collect.info_schema.userstats --collect.mysql.user --collect.perf_schema.eventsstatements --collect.perf_schema.eventsstatements.digest_text_limit=120 --collect.perf_schema.eventsstatements.limit=250 --collect.perf_schema.eventsstatements.timelimit=86400 --collect.perf_schema.eventsstatementssum --collect.perf_schema.eventswaits --collect.perf_schema.file_events --collect.perf_schema.file_instances --collect.perf_schema.file_instances.remove_prefix=false --collect.perf_schema.indexiowaits --collect.perf_schema.memory_events --collect.perf_schema.memory_events.remove_prefix=false --collect.perf_schema.tableiowaits --collect.perf_schema.tablelocks --collect.perf_schema.replication_group_members --collect.perf_schema.replication_group_member_stats --collect.perf_schema.replication_applier_status_by_worker --collect.slave_status --collect.slave_hosts --collect.heartbeat --collect.heartbeat.database=true --collect.heartbeat.table=true --collect.heartbeat.utc
```

### Prometheus 연결 확인

- localhost:9090 접속
- Status -> Targets 에서 메트릭 연결 확인

### Grafana 연결 및 대시보드 생성

- localhost:3000 접속
- ID : admin, PW : admin 으로 로그인
- Configuration -> Data Sources -> Prometheus 선택 -> URL에 `http://prom:9090` 입력 후 완료
- Dashboards -> New -> Import
- Import via grafana.com 에 다음 숫자를 입력 후 Load

> - 11378 `(spring boot monitor)` # Springboot 서버 상태 시각화
> - 1860 `(node exporter full)` # Database 컨테이너 시스템 상태 시각화
> - 7362 `(MySQL Overview)` # Database 상태 시각화

---

### 헬스케어 및 자원할당 모듈 실행

- health-care 디렉토리의 start.sh 쉘 스크립트를 실행

```
sh start.sh # 실행되지 않는 경우, g++ 설치 확인 및 쉘 스크립트 내용 한 줄씩 실행
```

### 헬스케어 규칙

- monitor.cpp의 CONTAINER_NUM은 헬스체크를 받는 컨테이너의 수
- monitor.cpp의 CONTAINERS는 헬스체크를 받는 컨테이너들의 이름들의 시퀀스
- 정지된 컨테이너를 발견하면 Docker API를 통해 컨테이너 재실행

### 자원할당 규칙

- 컨테이너들의 자원 초기 상태 : CpuShares 512, MemLimit 1gb
- CPU Share가 65%를 초과했을 때 -> CpuShares 를 1024로 스케일 아웃
- Mem Share가 60%를 초과했을 때 -> Mem Limit를 2gb로 스케일 아웃
- 스케일 아웃은 기본적으로 monitor.cpp의 `SCALE_DURATION` (line 10, 초 단위) 만큼 지속됨.
- 스케일 아웃된 시간이 SCALE_DURATION을 지났을 때
  - CPU Share가 65% 이하일 때 Cpu 스케일 인 (CpuShares 512)
  - Mem Share가 60% 이하일 때 Mem 스케일 인 (Mem Limit 1gb)

### 헬스케어 테스트 방법

- 임의의 컨테이너 stop 시킨 후 소생 확인

### 자원할당 테스트 방법

```
docker exec -it db-mysql sh # database 컨테이너 접속
cd root
rpm -ivh stress.rpm # stress 명령어 설치
stress -c 4 # CPU 부하 테스트
stress -m 2 # MEM 부하 테스트
```

- `docker stats`를 함께 띄워놓고 실행 시 편리함
- `docker inspect db-mysql | grep "CpuShares"` 로 CpuShare 변경 확인
- MEM Limit은 docker stats 에서 확인 가능
