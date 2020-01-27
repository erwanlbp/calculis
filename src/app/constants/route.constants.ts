export class RouteConstants {
    public static PLAY = 'play';
    public static HOME = 'home';
    public static SCORES = 'scores';
}

export class RoutePathConstants {
    public static ROOT = '/';
    public static PLAY = RoutePathConstants.ROOT + RouteConstants.PLAY;
    public static HOME = RoutePathConstants.ROOT + RouteConstants.HOME;
    public static SCORES = RoutePathConstants.ROOT + RouteConstants.SCORES;
}
