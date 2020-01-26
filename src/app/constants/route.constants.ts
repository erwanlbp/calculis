export class RouteConstants {
    public static PLAY = 'play';
    public static HOME = 'home';
}

export class RoutePathConstants {
    public static ROOT = '/';
    public static PLAY = RoutePathConstants.ROOT + RouteConstants.PLAY;
    public static HOME = RoutePathConstants.ROOT + RouteConstants.HOME;
}
