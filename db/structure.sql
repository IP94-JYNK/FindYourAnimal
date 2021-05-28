CREATE TABLE SystemUser (
  Id        serial,
  Name      varchar(64) NOT NULL,
  Password  varchar(255) NOT NULL,
  Email     text UNIQUE NOT NULL,
  Pet       boolean
);

ALTER TABLE SystemUser ADD CONSTRAINT pkSystemUser PRIMARY KEY (Id);

CREATE UNIQUE INDEX akSystemUserEmail ON SystemUser (Email);

CREATE TABLE Dialog (
  Id        serial,
  User1     text UNIQUE NOT NULL
  User2     text UNIQUE NOT NULL
);

ALTER TABLE Dialog ADD CONSTRAINT fkDialogUser1 FOREIGN KEY (User1) REFERENCES SystemUser (Email) ON DELETE CASCADE;
ALTER TABLE Dialog ADD CONSTRAINT fkDialogUser2 FOREIGN KEY (User2) REFERENCES SystemUser (Email) ON DELETE CASCADE;

CREATE TABLE Message (
  Id        serial,
  User      text UNIQUE NOT NULL
  DialogId    Int UNIQUE NOT NULL
);

ALTER TABLE Message ADD CONSTRAINT fkDialogUser FOREIGN KEY (User) REFERENCES SystemUser (Email) ON DELETE CASCADE;
ALTER TABLE Message ADD CONSTRAINT fkDialogDialogId FOREIGN KEY (DialogId) REFERENCES Dialog (Id) ON DELETE CASCADE;

CREATE TABLE petFinder (
  Id            serial,
  Phone         varchar(12),
  Description   text,
  Location      varchar(256),
  Whome         varchar(256),
  Age           integer,
  UserEmail     text UNIQUE NOT NULL
);

ALTER TABLE petFinder ADD CONSTRAINT fkpetFinderUserEmail FOREIGN KEY (UserEmail) REFERENCES SystemUser (Email) ON DELETE CASCADE;

ALTER TABLE petFinder ADD CONSTRAINT pkpetFinder PRIMARY KEY (Id);

CREATE TABLE petOwner (
  Id            serial,
  Phone         varchar(12),
  Description   text,
  Location      varchar(256),
  Age           integer,
  UserEmail     text UNIQUE NOT NULL
);

ALTER TABLE petOwner ADD CONSTRAINT fkpetOwnerUserEmail FOREIGN KEY (UserEmail) REFERENCES SystemUser (Email) ON DELETE CASCADE;

ALTER TABLE petOwner ADD CONSTRAINT pkpetOwner PRIMARY KEY (Id);

CREATE TABLE pet (
  Id            serial,
  Alias         varchar(256),
  Type          varchar(50),
  Species       varchar(256),
  Description   text,
  Age           varchar(256),
  Sex           varchar(10),
  OwnerEmail    text UNIQUE NOT NULL
);

ALTER TABLE pet ADD CONSTRAINT fkpetOwnerEmail FOREIGN KEY (OwnerEmail) REFERENCES petOwner (UserEmail) ON DELETE CASCADE;

ALTER TABLE pet ADD CONSTRAINT pkpet PRIMARY KEY (Id);

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
