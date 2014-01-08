process:

    `mdown install`
    creates boilerplate with folders

    `mdown preview` (watch+generate+dashboard)
    run dashboard with gui, eshop, settings

    _`mdown generate settings`
    pregenerate all necessary settings to _settings

    _`mdown generate layout`
    takes all layout files and use layout from _theme

    _`mdown generate`
    makes settings and layout in one time

    `mdown deploy`
    deploy based on _settings website via sftp/rsync


easy user:

    `mdown install`
    `mdown dashboard`
        - shop
        - settings
        - layout
        - articles
        - generate
        - deploy

developer user:

    `mdown install theme settings`
    `mdown preview`
    `mdown generate`
