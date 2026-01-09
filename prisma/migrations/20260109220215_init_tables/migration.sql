BEGIN TRY

BEGIN TRAN;

-- CreateTable
CREATE TABLE [dbo].[Users] (
    [Id] INT NOT NULL IDENTITY(1,1),
    [Nombre] NVARCHAR(120) NOT NULL,
    [SupervisorId] INT,
    CONSTRAINT [Users_pkey] PRIMARY KEY CLUSTERED ([Id])
);

-- CreateTable
CREATE TABLE [dbo].[Projects] (
    [Id] INT NOT NULL IDENTITY(1,1),
    [Nombre] NVARCHAR(120) NOT NULL,
    CONSTRAINT [Projects_pkey] PRIMARY KEY CLUSTERED ([Id])
);

-- CreateTable
CREATE TABLE [dbo].[Packages] (
    [Id] INT NOT NULL IDENTITY(1,1),
    [Nombre] NVARCHAR(120) NOT NULL,
    [ProyectoId] INT NOT NULL,
    CONSTRAINT [Packages_pkey] PRIMARY KEY CLUSTERED ([Id])
);

-- CreateTable
CREATE TABLE [dbo].[ActivityCatalog] (
    [Id] INT NOT NULL IDENTITY(1,1),
    [Nombre] NVARCHAR(120) NOT NULL,
    [ProyectoId] INT NOT NULL,
    CONSTRAINT [ActivityCatalog_pkey] PRIMARY KEY CLUSTERED ([Id])
);

-- CreateTable
CREATE TABLE [dbo].[Activities] (
    [Id] INT NOT NULL IDENTITY(1,1),
    [Nombre] NVARCHAR(160) NOT NULL,
    [Descripcion] NVARCHAR(500),
    [Horas] DECIMAL(6,2) NOT NULL,
    [Fecha] DATE NOT NULL,
    [UsuarioId] INT NOT NULL,
    [ProyectoId] INT NOT NULL,
    [CatalogoId] INT NOT NULL,
    [PaqueteId] INT,
    CONSTRAINT [Activities_pkey] PRIMARY KEY CLUSTERED ([Id])
);

-- CreateIndex
CREATE NONCLUSTERED INDEX [IX_Activities_ProyectoId] ON [dbo].[Activities]([ProyectoId]);

-- CreateIndex
CREATE NONCLUSTERED INDEX [IX_Activities_UsuarioId] ON [dbo].[Activities]([UsuarioId]);

-- CreateIndex
CREATE NONCLUSTERED INDEX [IX_Activities_Fecha] ON [dbo].[Activities]([Fecha]);

-- AddForeignKey
ALTER TABLE [dbo].[Packages] ADD CONSTRAINT [Packages_ProyectoId_fkey] FOREIGN KEY ([ProyectoId]) REFERENCES [dbo].[Projects]([Id]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[ActivityCatalog] ADD CONSTRAINT [ActivityCatalog_ProyectoId_fkey] FOREIGN KEY ([ProyectoId]) REFERENCES [dbo].[Projects]([Id]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[Activities] ADD CONSTRAINT [Activities_UsuarioId_fkey] FOREIGN KEY ([UsuarioId]) REFERENCES [dbo].[Users]([Id]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[Activities] ADD CONSTRAINT [Activities_ProyectoId_fkey] FOREIGN KEY ([ProyectoId]) REFERENCES [dbo].[Projects]([Id]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[Activities] ADD CONSTRAINT [Activities_CatalogoId_fkey] FOREIGN KEY ([CatalogoId]) REFERENCES [dbo].[ActivityCatalog]([Id]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[Activities] ADD CONSTRAINT [Activities_PaqueteId_fkey] FOREIGN KEY ([PaqueteId]) REFERENCES [dbo].[Packages]([Id]) ON DELETE NO ACTION ON UPDATE NO ACTION;

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH
