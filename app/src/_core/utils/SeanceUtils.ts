import EventNormalizedSeanceModel from "@/modules/Events/models/EventNormalizedSeanceModel";
import { Seances } from "@/modules/Events/models/EventSeancesModel";
import CityModel from "@/modules/Main/models/CityModel";

export const normalizeSeances = (arr: Seances): EventNormalizedSeanceModel[] => {
  const normalizedSeances: EventNormalizedSeanceModel[] = [];

  arr?.places.forEach((place) => {
    place.seances.forEach((seance) => {
      const placeData = {
        address: place.address,
        placeName: place.name,
        geoLat: place.geoLat || place.city.geoLat || undefined,
        geoLon: place.geoLon || place.city.geoLon || undefined,
        city: {
          id: place.city.cityId,
          region: place.city.region,
          name: place.city.city,
          timezoneOffset: place.city.timezoneOffset,
        },
      };
      const newSeance = { ...seance, ...placeData } as EventNormalizedSeanceModel;
      normalizedSeances.push(newSeance);
    });
  });

  return normalizedSeances;
};

export const setTimezoneOffset = (seances: EventNormalizedSeanceModel[], cities: CityModel[]): EventNormalizedSeanceModel[] => {
  return seances.map((item) => {
    let newItem = {} as EventNormalizedSeanceModel;
    const seanceCity = cities.find((city) => city.id === item.city.id);

    if (seanceCity) {
      newItem = {
        ...item,
        since: item.since + seanceCity.timezoneOffset,
        till: item.till + seanceCity.timezoneOffset,
      } as EventNormalizedSeanceModel;
    } else {
      newItem = {
        ...item,
        since: item.since,
        till: item.till,
      } as EventNormalizedSeanceModel;
    }

    return newItem;
  });
};
