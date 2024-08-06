
export interface CityProperties {
    ID: number;
    Cityname: string;
    Cityimage: string;
}

export interface CityGeometry {
    type: string;
    coordinates: number[];
}

export interface CityFeature {
    type: string;
    properties: CityProperties;
    geometry: CityGeometry;
}

export interface CityData {
    type: string;
    features: CityFeature[];
}
