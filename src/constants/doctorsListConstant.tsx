const governorates = [
    { value: "", label: "All governorates" },

    { value: "Alexandria", label: "Alexandria" },
    { value: "Aswan", label: "Aswan" },
    { value: "Assiut", label: "Assiut" },
    { value: "Beheira", label: "Beheira" },
    { value: "Beni Suef", label: "Beni Suef" },
    { value: "Cairo", label: "Cairo" },
    { value: "Dakahlia", label: "Dakahlia" },
    { value: "Damietta", label: "Damietta" },
    { value: "Fayoum", label: "Fayoum" },
    { value: "Gharbia", label: "Gharbia" },
    { value: "Giza", label: "Giza" },
    { value: "Ismailia", label: "Ismailia" },
    { value: "Kafr el-Sheikh", label: "Kafr el-Sheikh" },
    { value: "Luxor", label: "Luxor" },
    { value: "Matrouh", label: "Matrouh" },
    { value: "Minya", label: "Minya" },
    { value: "Menofia", label: "Menofia" },
    { value: "New Valley", label: "New Valley" },
    { value: "North Sinai", label: "North Sinai" },
    { value: "Port Said", label: "Port Said" },
    { value: "Qalyubia", label: "Qalyubia" },
    { value: "Qena", label: "Qena" },
    { value: "Red Sea", label: "Red Sea" },
    { value: "Al Sharqia", label: "Al Sharqia" },
    { value: "Sohag", label: "Sohag" },
    { value: "South Sinai", label: "South Sinai" },
    { value: "Suez", label: "Suez" },
];

const regions: Record<
    string,
    { value: string; label: string }[]
> = {
    Alexandria: [
        { value: "Montaza", label: "Montaza" },
        { value: "Sidi Gaber", label: "Sidi Gaber" },
        { value: "Smouha", label: "Smouha" },
        { value: "Miami", label: "Miami" },
        { value: "Stanley", label: "Stanley" },
        { value: "Borg El Arab", label: "Borg El Arab" },
        { value: "Gleem", label: "Gleem" },
        { value: "Sporting", label: "Sporting" },
        { value: "Raml Station", label: "Raml Station" },
        { value: "Bakos", label: "Bakos" },
    ],

    Aswan: [
        { value: "Aswan City", label: "Aswan City" },
        { value: "Edfu", label: "Edfu" },
        { value: "Kom Ombo", label: "Kom Ombo" },
        { value: "Daraw", label: "Daraw" },
        { value: "Abu Simbel", label: "Abu Simbel" },
        { value: "Nasr El Nuba", label: "Nasr El Nuba" },
    ],

    Assiut: [
        { value: "Assiut City", label: "Assiut City" },
        { value: "Dairut", label: "Dairut" },
        { value: "Manfalut", label: "Manfalut" },
        { value: "Abnoub", label: "Abnoub" },
        { value: "Abu Tig", label: "Abu Tig" },
        { value: "El Badari", label: "El Badari" },
    ],

    Beheira: [
        { value: "Damanhour", label: "Damanhour" },
        { value: "Kafr El Dawwar", label: "Kafr El Dawwar" },
        { value: "Rashid", label: "Rashid" },
        { value: "Edku", label: "Edku" },
        { value: "Abu Hummus", label: "Abu Hummus" },
        { value: "Shubrakhit", label: "Shubrakhit" },
        { value: "Itay El Barud", label: "Itay El Barud" },
    ],

    "Beni Suef": [
        { value: "Beni Suef City", label: "Beni Suef City" },
        { value: "Al Wasta", label: "Al Wasta" },
        { value: "Nasser", label: "Nasser" },
        { value: "Ehnasia", label: "Ehnasia" },
        { value: "Biba", label: "Biba" },
        { value: "Samasta", label: "Samasta" },
    ],

    Cairo: [
        { value: "Nasr City", label: "Nasr City" },
        { value: "Heliopolis", label: "Heliopolis" },
        { value: "Maadi", label: "Maadi" },
        { value: "New Cairo", label: "New Cairo" },
        { value: "Shubra", label: "Shubra" },
        { value: "Helwan", label: "Helwan" },
        { value: "Downtown", label: "Downtown" },
        { value: "Zamalek", label: "Zamalek" },
        { value: "Mokattam", label: "Mokattam" },
        { value: "Ain Shams", label: "Ain Shams" },
        { value: "El Marg", label: "El Marg" },
        { value: "Hadayek El Kobba", label: "Hadayek El Kobba" },
        { value: "Madinaty", label: "Madinaty" },
        { value: "Rehab", label: "Rehab" },
    ],

    Dakahlia: [
        { value: "Mansoura", label: "Mansoura" },
        { value: "Talkha", label: "Talkha" },
        { value: "Mit Ghamr", label: "Mit Ghamr" },
        { value: "Belqas", label: "Belqas" },
        { value: "Dekernes", label: "Dekernes" },
        { value: "Sherbin", label: "Sherbin" },
        { value: "Aga", label: "Aga" },
    ],

    Damietta: [
        { value: "Damietta City", label: "Damietta City" },
        { value: "Ras El Bar", label: "Ras El Bar" },
        { value: "Kafr Saad", label: "Kafr Saad" },
        { value: "Faraskur", label: "Faraskur" },
        { value: "New Damietta", label: "New Damietta" },
    ],

    Fayoum: [
        { value: "Fayoum City", label: "Fayoum City" },
        { value: "Ibshway", label: "Ibshway" },
        { value: "Senuris", label: "Senuris" },
        { value: "Tamiya", label: "Tamiya" },
        { value: "Youssef El Seddik", label: "Youssef El Seddik" },
    ],

    Gharbia: [
        { value: "Tanta", label: "Tanta" },
        { value: "El Mahalla El Kubra", label: "El Mahalla El Kubra" },
        { value: "Kafr El Zayat", label: "Kafr El Zayat" },
        { value: "Zefta", label: "Zefta" },
        { value: "Samanoud", label: "Samanoud" },
        { value: "Basyoun", label: "Basyoun" },
    ],

    Giza: [
        { value: "Dokki", label: "Dokki" },
        { value: "Mohandessin", label: "Mohandessin" },
        { value: "6th of October", label: "6th of October" },
        { value: "Sheikh Zayed", label: "Sheikh Zayed" },
        { value: "Haram", label: "Haram" },
        { value: "Faisal", label: "Faisal" },
        { value: "Agouza", label: "Agouza" },
        { value: "Imbaba", label: "Imbaba" },
        { value: "Bulaq El Dakrour", label: "Bulaq El Dakrour" },
        { value: "Hadayek Al Ahram", label: "Hadayek Al Ahram" },
    ],

    Ismailia: [
        { value: "Ismailia City", label: "Ismailia City" },
        { value: "Fayed", label: "Fayed" },
        { value: "Qantara East", label: "Qantara East" },
        { value: "Qantara West", label: "Qantara West" },
        { value: "Abu Sultan", label: "Abu Sultan" },
    ],

    "Kafr el-Sheikh": [
        { value: "Kafr El Sheikh City", label: "Kafr El Sheikh City" },
        { value: "Desouk", label: "Desouk" },
        { value: "Baltim", label: "Baltim" },
        { value: "Fuwwah", label: "Fuwwah" },
        { value: "Sidi Salem", label: "Sidi Salem" },
    ],

    Luxor: [
        { value: "Luxor City", label: "Luxor City" },
        { value: "Armant", label: "Armant" },
        { value: "Esna", label: "Esna" },
        { value: "Tiba", label: "Tiba" },
        { value: "Al Bayadiyah", label: "Al Bayadiyah" },
    ],

    Matrouh: [
        { value: "Marsa Matrouh", label: "Marsa Matrouh" },
        { value: "El Alamein", label: "El Alamein" },
        { value: "Siwa", label: "Siwa" },
        { value: "Dabaa", label: "Dabaa" },
    ],

    Minya: [
        { value: "Minya City", label: "Minya City" },
        { value: "Mallawi", label: "Mallawi" },
        { value: "Beni Mazar", label: "Beni Mazar" },
        { value: "Samalut", label: "Samalut" },
        { value: "Maghagha", label: "Maghagha" },
    ],

    Menofia: [
        { value: "Shibin El Kom", label: "Shibin El Kom" },
        { value: "Menouf", label: "Menouf" },
        { value: "Ashmoun", label: "Ashmoun" },
        { value: "Sadat City", label: "Sadat City" },
        { value: "Quesna", label: "Quesna" },
    ],

    "New Valley": [
        { value: "Kharga", label: "Kharga" },
        { value: "Dakhla", label: "Dakhla" },
        { value: "Farafra", label: "Farafra" },
        { value: "Baris", label: "Baris" },
    ],

    "North Sinai": [
        { value: "Arish", label: "Arish" },
        { value: "Sheikh Zuweid", label: "Sheikh Zuweid" },
        { value: "Rafah", label: "Rafah" },
        { value: "Bir El Abd", label: "Bir El Abd" },
    ],

    "Port Said": [
        { value: "Port Fouad", label: "Port Fouad" },
        { value: "Al Arab", label: "Al Arab" },
        { value: "Al Dawahy", label: "Al Dawahy" },
        { value: "El Manakh", label: "El Manakh" },
    ],

    Qalyubia: [
        { value: "Banha", label: "Banha" },
        { value: "Shubra El Kheima", label: "Shubra El Kheima" },
        { value: "Qalyub", label: "Qalyub" },
        { value: "Obour", label: "Obour" },
        { value: "Khosous", label: "Khosous" },
        { value: "Toukh", label: "Toukh" },
    ],

    Qena: [
        { value: "Qena City", label: "Qena City" },
        { value: "Nag Hammadi", label: "Nag Hammadi" },
        { value: "Qus", label: "Qus" },
        { value: "Dishna", label: "Dishna" },
    ],

    "Red Sea": [
        { value: "Hurghada", label: "Hurghada" },
        { value: "Safaga", label: "Safaga" },
        { value: "Marsa Alam", label: "Marsa Alam" },
        { value: "El Gouna", label: "El Gouna" },
        { value: "Quseir", label: "Quseir" },
    ],

    Sohag: [
        { value: "Sohag City", label: "Sohag City" },
        { value: "Akhmim", label: "Akhmim" },
        { value: "Tahta", label: "Tahta" },
        { value: "Girga", label: "Girga" },
        { value: "El Balyana", label: "El Balyana" },
    ],

    "South Sinai": [
        { value: "Sharm El Sheikh", label: "Sharm El Sheikh" },
        { value: "Dahab", label: "Dahab" },
        { value: "Nuweiba", label: "Nuweiba" },
        { value: "Taba", label: "Taba" },
        { value: "Ras Sedr", label: "Ras Sedr" },
    ],

    Suez: [
        { value: "Suez City", label: "Suez City" },
        { value: "Ain Sokhna", label: "Ain Sokhna" },
        { value: "Arbaeen", label: "Arbaeen" },
        { value: "Faisal", label: "Faisal" },
    ],
};
const selectInputData = [
    {
        id: "experience",
        label: "Experience",
        options: [
            { value: "", label: "All" },
            { value: "ZeroToFive", label: "0-5 years" },
            { value: "FiveToTen", label: "5-10 years" },
            { value: "TenToFifteen", label: "10-15 years" },
            { value: "FifteenPlus", label: "15+ years" },
        ],
    },

    {
        id: "rating",
        label: "Rating",
        options: [
            { value: "", label: "All" },
            { value: "ThreeAndHalf", label: "3.5+ Stars" },
            { value: "Four", label: "4.0 Stars" },
            { value: "FourAndHalf", label: "4.5+ Stars" },
        ],
    },

    {
        id: "availability",
        label: "Availability",
        options: [
            { value: "", label: "All" },
            { value: "AvailableNow", label: "Available Now" },
            { value: "Busy", label: "Busy" },
            { value: "Offline", label: "Offline" },
        ],
    },

    {
        id: "gender",
        label: "Gender",
        options: [
            { value: "", label: "All" },
            { value: "Male", label: "Male" },
            { value: "Female", label: "Female" },
        ],
    },

    {
        id: "sort",
        label: "Sort By",
        options: [
            { value: "", label: "All" },
            { value: "HighestRating", label: "Highest Rating" },
            { value: "MostExperienced", label: "Most Experienced" },
            { value: "LowestFee", label: "Lowest Fee" },
        ],
    },
];


export { selectInputData, governorates, regions }