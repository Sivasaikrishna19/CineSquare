export interface ITheater {
  name: string;
  address: string;
  location: {
    latitude: number;
    longitude: number;
  };
  distance: number;
  zip_code: string;
  short_address: string;
  technologies: Array<string>;
  cuisines: Array<string>;
  shows: Array<string>;
  no_of_rows: number;
  no_of_cols: number;
  id: number;
}

export interface TheaterFilter {
  title: { label: string; value: string };
  options: Array<{ label: string; value: string }>;
}
