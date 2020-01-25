FROM ubuntu

RUN apt-get update && apt-get install -y awscli

ADD entrypoint.sh /entrypoint.sh
ENTRYPOINT ["/entrypoint.sh"]
