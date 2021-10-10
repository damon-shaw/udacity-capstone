export class Plate {
    id: string;
    state: string;
    available: boolean;
    lastChecked: Date;
    favorited: boolean = false;
}
