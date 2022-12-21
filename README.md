# trip-msa

### 각 컨테이너 빌드
```
docker build -t mydb ./mydb
docker build -t bookmark ./bookmark 
docker build -t user ./user  
docker build -t nearspot ./nearspot  
docker build -t review ./review 
docker build -t place ./place
```

### 도커 컴포즈

docker-compose up --build -d

### compose up 후
docker exec -it db-mysql sh

mysql -uroot -p

1234

CREATE USER 'exporter'@'%' IDENTIFIED BY '1234';

GRANT PROCESS, REPLICATION CLIENT, SELECT ON *.* TO 'exporter'@'%';

exit



cd root

./node_exporter



Ctrl P + Q



```
docker run -d --name exporter -p 9104:9104 --network trip-msa_default --env DATA_SOURCE_NAME="exporter:1234@(db-mysql:3306)/" prom/mysqld-exporter:latest --collect.engine_tokudb_status --collect.global_status --collect.global_variables --collect.info_schema.clientstats --collect.info_schema.innodb_metrics --collect.info_schema.innodb_tablespaces --collect.info_schema.innodb_cmp --collect.info_schema.innodb_cmpmem --collect.info_schema.processlist --collect.info_schema.processlist.min_time=0 --collect.info_schema.query_response_time --collect.info_schema.replica_host --collect.info_schema.tables --collect.info_schema.tables.databases=‘*’ --collect.info_schema.tablestats --collect.info_schema.schemastats --collect.info_schema.userstats --collect.mysql.user --collect.perf_schema.eventsstatements --collect.perf_schema.eventsstatements.digest_text_limit=120 --collect.perf_schema.eventsstatements.limit=250 --collect.perf_schema.eventsstatements.timelimit=86400 --collect.perf_schema.eventsstatementssum --collect.perf_schema.eventswaits --collect.perf_schema.file_events --collect.perf_schema.file_instances --collect.perf_schema.file_instances.remove_prefix=false --collect.perf_schema.indexiowaits --collect.perf_schema.memory_events --collect.perf_schema.memory_events.remove_prefix=false --collect.perf_schema.tableiowaits --collect.perf_schema.tablelocks --collect.perf_schema.replication_group_members --collect.perf_schema.replication_group_member_stats --collect.perf_schema.replication_applier_status_by_worker --collect.slave_status --collect.slave_hosts --collect.heartbeat --collect.heartbeat.database=true --collect.heartbeat.table=true --collect.heartbeat.utc
```



localhost:3000 접속

admin / admin으로 로그인

configuration->data sources -> 프로메테우스 선택 -> URL에 http://prom:9090 입력 후 완료

> 대쉬보드 Import
>
> 1860 : node exporter full
>
> 11378 : spring boot monitor
