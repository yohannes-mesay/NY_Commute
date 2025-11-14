// Hardcoded list replaced with Supabase data - see useNJTransitStations hook
// export const NJ_STATIONS = [
//   "Aberdeen Matawan Station", "Allendale Station", "Allenhurst Station", "Anderson Street Station",
//   "Annandale Station", "Asbury Park Station", "Avenel Station", "Basking Ridge Station",
//   "Bay Head Station", "Bay Street Station", "Belmar Station", "Berkeley Heights Station",
//   "Bernardsville Station", "Bloomfield Rail Station", "Boonton Station", "Bound Brook Station",
//   "Bradley Beach Station", "Brick Church Station", "Bridgewater Station", "Broadway Station Fair Lawn",
//   "Chatham Station", "Clifton Station", "Convent Station", "Cranford Station",
//   "Delawanna Station", "Denville Station", "Dover Station", "Dunellen Station",
//   "East Orange Station", "Edison Station", "Elberon Station", "Elizabeth Station",
//   "Emerson Station", "Essex Street Station (PVL)", "EWR Newark Airport Station", "Fanwood Station",
//   "Far Hills Station", "Garfield Station", "Garwood Station", "Gillette Station",
//   "Gladstone Station", "Glen Ridge Station", "Glen Rock Boro Hall Station", "Glen Rock Main Line Station",
//   "Hackettstown Station", "Hamilton Station", "Hawthorne Station", "Hazlet Station",
//   "High Bridge Station", "Highland Avenue Station", "Hillsdale Station", "Ho-Ho-Kus Station",
//   "Jersey Avenue Station (Northeast Corridor)", "Kingsland Station", "Lake Hopatcong Station", "Lebanon Station",
//   "Lincoln Park Station", "Linden Station", "Little Falls Station", "Little Silver Station",
//   "Long Branch Station", "Lyndhurst Station", "Lyons Station", "Madison Station",
//   "Mahwah Station", "Manasquan Station", "Maplewood Station", "Metropark Station",
//   "Metuchen Station", "Middletown New Jersey Station", "Millburn Station", "Millington Station",
//   "Monmouth Park Station", "Montclair Heights Station", "Montclair State University Station", "Montvale Station",
//   "Morris Plains Station", "Morristown Station", "Mount Arlington Station", "Mount Olive Station",
//   "Mount Tabor Station", "Mountain Avenue Station", "Mountain Lakes Station", "Mountain Station",
//   "Mountain View Station", "MSU Station", "Mt. Olive Station", "Murray Hill Station",
//   "Nanuet Station", "Netcong Station", "Netherwood Station", "New Bridge Landing Station",
//   "New Brunswick Station", "New Providence Station", "Newark Broad Street Station", "Newark Liberty International Airport",
//   "Newark Penn Station", "North Branch Station", "North Elizabeth Station", "Oradell Station",
//   "Orange Station", "Park Ridge Station", "Passaic Station", "Paterson Station",
//   "Peapack Station", "Pearl River Station", "Penn Station Newark", "Perth Amboy Station",
//   "Plainfield Station", "Plauderville Station", "Point Pleasant Beach Station", "Princeton Junction Station",
//   "Princeton Station", "Radburn Station", "Rahway Station", "Ramsey Main Street Station",
//   "Ramsey Route 17 Station", "Raritan Station", "Red Bank Station", "Ridgewood Station",
//   "River Edge Station", "Roselle Park Station", "Rutherford Station", "Short Hills Station",
//   "Somerville Station", "South Amboy Station", "South Orange Station", "Spring Lake Station",
//   "Spring Valley Station", "Stirling Station", "Suffern Station", "Summit Station",
//   "Teterboro Station", "Towaco Station", "Trenton Transit Center", "Union Station",
//   "Upper Montclair Station", "Waldwick Station", "Walnut Street Station", "Watchung Avenue Station",
//   "Watsessing Avenue Station", "Wayne/Route 23 Transit Center Rail Station", "Wesmont Station", "Westfield Station",
//   "Westwood Station", "White House Station", "Wood Ridge Station", "Woodbridge Station",
//   "Woodcliff Lake Station"
// ];

export const COMMUTE_METHODS = [
  "Drive",
  "Uber",
  "Luxury Car",
  "NJ Transit",
  "Boxcar Bus",
];

export const DEPARTURE_TIMES = [
  "Before 6:00am",
  "6:00 – 6:30am",
  "6:30 – 7:00am",
  "7:00 – 7:30am",
  "7:30 - 8:00am",
  "After 8:00am",
];

export const MODE_COLORS: Record<string, string> = {
  selfDrive: "#DC2626", // self driving - red
  driving: "#DC2626",
  njTransit: "#7F1D1D", // dark red
  boxcar: "#1D4ED8", // blue
  boxcarMember: "#60A5FA", // light blue
  uber: "#7E22CE", // purple
  luxuryCar: "#16A34A", // green
  luxury: "#16A34A",
};
