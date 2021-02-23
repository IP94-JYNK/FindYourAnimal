CREATE TABLE SystemUser (
  Id        serial,
  Name      varchar(64) NOT NULL,
  Password  varchar(255) NOT NULL,
  Email     text NOT NULL,
  FullName  varchar(255)
);

ALTER TABLE SystemUser ADD CONSTRAINT pkSystemUser PRIMARY KEY (Id);

CREATE UNIQUE INDEX akSystemUserEmail ON SystemUser (Email);

CREATE TABLE Session (
  Id      serial,
  UserId  integer NOT NULL,
  Token   varchar(64) NOT NULL,
  IP      varchar(45) NOT NULL,
  Data    text
);

ALTER TABLE Session ADD CONSTRAINT pkSession PRIMARY KEY (Id);

CREATE UNIQUE INDEX akSession ON Session (Token);

ALTER TABLE Session ADD CONSTRAINT fkSessionUserId FOREIGN KEY (UserId) REFERENCES SystemUser (Id) ON DELETE CASCADE;

CREATE TABLE ConfirmUrl (
  Id        serial,
  UserId    integer NOT NULL,
  TimeStamp timestamp NOT NULL DEFAULT NOW(),
  Link      text NOT NULL
);

ALTER TABLE ConfirmUrl ADD CONSTRAINT pkUrl PRIMARY KEY (Id);

CREATE UNIQUE INDEX akUrlLink ON ConfirmUrl (Link);

ALTER TABLE ConfirmUrl ADD CONSTRAINT fkUrlUserId FOREIGN KEY (UserId) REFERENCES SystemUser (Id) ON DELETE CASCADE;
