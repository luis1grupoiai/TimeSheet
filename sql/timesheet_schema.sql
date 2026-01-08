-- SQL Server schema for TimeSheet

CREATE TABLE dbo.Users (
  Id INT IDENTITY(1,1) PRIMARY KEY,
  Nombre NVARCHAR(120) NOT NULL,
  SupervisorId INT NULL
);

CREATE TABLE dbo.Projects (
  Id INT IDENTITY(1,1) PRIMARY KEY,
  Nombre NVARCHAR(120) NOT NULL
);

CREATE TABLE dbo.Packages (
  Id INT IDENTITY(1,1) PRIMARY KEY,
  Nombre NVARCHAR(120) NOT NULL,
  ProyectoId INT NOT NULL,
  CONSTRAINT FK_Packages_Projects
    FOREIGN KEY (ProyectoId) REFERENCES dbo.Projects(Id)
);

CREATE TABLE dbo.ActivityCatalog (
  Id INT IDENTITY(1,1) PRIMARY KEY,
  Nombre NVARCHAR(120) NOT NULL,
  ProyectoId INT NOT NULL,
  CONSTRAINT FK_ActivityCatalog_Projects
    FOREIGN KEY (ProyectoId) REFERENCES dbo.Projects(Id)
);

CREATE TABLE dbo.Activities (
  Id INT IDENTITY(1,1) PRIMARY KEY,
  Nombre NVARCHAR(160) NOT NULL,
  Descripcion NVARCHAR(500) NULL,
  Horas DECIMAL(6,2) NOT NULL,
  Fecha DATE NOT NULL,
  UsuarioId INT NOT NULL,
  ProyectoId INT NOT NULL,
  CatalogoId INT NOT NULL,
  PaqueteId INT NULL,
  CONSTRAINT FK_Activities_Users
    FOREIGN KEY (UsuarioId) REFERENCES dbo.Users(Id),
  CONSTRAINT FK_Activities_Projects
    FOREIGN KEY (ProyectoId) REFERENCES dbo.Projects(Id),
  CONSTRAINT FK_Activities_Catalog
    FOREIGN KEY (CatalogoId) REFERENCES dbo.ActivityCatalog(Id),
  CONSTRAINT FK_Activities_Packages
    FOREIGN KEY (PaqueteId) REFERENCES dbo.Packages(Id)
);

CREATE INDEX IX_Activities_ProyectoId ON dbo.Activities(ProyectoId);
CREATE INDEX IX_Activities_UsuarioId ON dbo.Activities(UsuarioId);
CREATE INDEX IX_Activities_Fecha ON dbo.Activities(Fecha);
