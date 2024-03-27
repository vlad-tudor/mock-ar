import { customFetch } from "./fetchUtils";

type LongitudeLatitudeBoundingBox = {
  longitudeMin: number;
  latitudeMin: number;
  longitudeMax: number;
  latitudeMax: number;
};

export type AircraftState = [
  icao24: string,
  callsign: string | null,
  origin_country: string,
  time_position: number | null,
  last_contact: number,
  longitude: number | null,
  latitude: number | null,
  baro_altitude: number | null,
  on_ground: boolean,
  velocity: number | null,
  true_track: number | null,
  vertical_rate: number | null,
  sensors: number[] | null,
  geo_altitude: number | null,
  squawk: string | null,
  spi: boolean,
  position_source: 0 | 1 | 2 | 3,
  // prettier-ignore
  category: 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | 13 | 14 | 15 | 16 | 17 | 18 | 19 | 20
];

type BoundingBoxResponse = {
  time: number;
  states: AircraftState[];
};

export function getLondonPlanes() {
  return getBoundingBoxPlanes({
    longitudeMin: -0.5,
    longitudeMax: 0.2,
    latitudeMin: 51.4,
    latitudeMax: 51.6,
  }).then(({ states }) => states);
}

function getBoundingBoxPlanes({
  longitudeMin,
  longitudeMax,
  latitudeMin,
  latitudeMax,
}: LongitudeLatitudeBoundingBox) {
  return customFetch<BoundingBoxResponse>(
    `https://opensky-network.org/api/states/all?lamin=${latitudeMin}&lomin=${longitudeMin}&lamax=${latitudeMax}&lomax=${longitudeMax}`
  );
}
