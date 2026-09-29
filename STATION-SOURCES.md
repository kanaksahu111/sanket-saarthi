# Station catalog sources

The catalog in `src/data/stations.js` contains 39 configured station records across 12 city/metro areas. There is no station-count cap per city. Search matches English/Hindi city and station names, codes and common city aliases. Only BPL currently has indoor guidance and a Firebase operations binding; the others are searchable catalog entries and cannot start a fabricated route.

Verification sources (checked 30 September 2026):

- [Indian Railways Station Code Index](https://indianrailways.gov.in/railwayboard/uploads/directorate/coaching/TAG_2019-20/Station_Code_Index.pdf): principal source for names and codes. It is an older official index; old Habibganj/HBJ was not retained as the current code.
- [West Central Railway annual report 2023–24](https://wcr.indianrailways.gov.in/uploads/files/1747652113612-GMAR%202023-24%20Final%20Approved.pdf): Rani Kamlapati/RKMP.
- [Indian Railways Duronto list](https://www.indianrail.gov.in/duronto_trn_list.html): Mumbai Central/MMCT and Chhatrapati Shivaji Maharaj Terminus/CSMT.

City grouping means city/metro search coverage, not municipal boundaries (for example Howrah for Kolkata, Kalyan/Panvel for Mumbai). Hindi labels are translations/transliterations of the names, not separate station identifiers. More entries can be added to the same data array after source verification.
# Expanded geographic catalog — September 30, 2026

`src/data/station-catalog.json` is a compact conversion of [DataMeet railways stations.json](https://github.com/datameet/railways/blob/master/stations.json), licensed [CC0 in the source README](https://github.com/datameet/railways). Downloaded from the project's raw master URL on September 30, 2026. Original file SHA-256: `9BD5E1DA3A859E5359A95F40B6009AA468EFB177DA4FAAC57FFDCD7DAEB4DF18`.

Original: 8,990 features. Stored: 8,965 rows with station codes/names. Compact row schema: code, name, state, address, [longitude,latitude]. stationService deduplicates codes, reconciles HBJ→RKMP, BCT→MMCT, CSTM→CSMT using the curated catalog, excludes explicitly foreign state labels, and exposes 8,963 records after merging. Coordinates outside the regional numeric bounds are omitted from maps; identity remains searchable. Source coordinates are geographic reference data, not surveyed or current accessibility information. Some names/closures may be outdated; the dataset does not claim live railway completeness.

Existing curated Hindi names and city groupings remain below. Real station location is separate from the BPL demo interior. Map tiles use [OpenStreetMap](https://www.openstreetmap.org/copyright) with its [tile usage policy](https://operations.osmfoundation.org/policies/tiles/).

