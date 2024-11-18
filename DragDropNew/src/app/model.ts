export interface Device {
    id: number;
    name: string;
    type: string;
    boundary: string;
    elementLimit?: number;
    width?: number;
    height?: number;
    children?: Device[]
}
