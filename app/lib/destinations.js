export const destinations = [
    // India - Historical & Heritage
    {
        id: "jaipur",
        latitude: 26.9124,
        longitude: 75.7873,
        name: "Jaipur",
        country: "India",
        category: "historical",
        description: "The Pink City, known for its majestic palaces, forts, and rich culture. A royal experience awaits.",
        image: "https://upload.wikimedia.org/wikipedia/commons/c/c3/Hawa_Mahal_Jaipur.jpg",
        price: "₹12,000",
        placesToVisit: [
            {
                name: "Hawa Mahal",
                image: "https://upload.wikimedia.org/wikipedia/commons/c/c3/Hawa_Mahal_Jaipur.jpg",
                description: "The Palace of Winds, famous for its unique honeycomb-like structure."
            },
            {
                name: "Amber Fort",
                image: "https://upload.wikimedia.org/wikipedia/commons/8/85/Amer_Fort_Entrance.jpg",
                description: "A magnificent fort located high on a hill, known for its artistic style elements."
            },
            {
                name: "City Palace",
                image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQGN2rvi6DT6yPxHy3QHEKwsi0NPNWlTVCJ8g&s",
                // image: "https://upload.wikimedia.org/wikipedia/commons/thumb/1/17/City_Palace%2C_Jaipur.jpg/800px-City_Palace%2C_Jaipur.jpg",
                description: "A complex of courtyards, gardens, and buildings right in the center of the Old City."
            },
            {
                name: "Jantar Mantar",
                image: "https://upload.wikimedia.org/wikipedia/commons/7/7b/Jantar_Mantar_Jaipur.jpg",
                description: "A collection of nineteen architectural astronomical instruments."
            },
            {
                name: "Nahargarh Fort",
                image: "https://upload.wikimedia.org/wikipedia/commons/e/ed/Nahargarh_Fort_Jaipur.jpg",
                description: "Stands on the edge of the Aravalli Hills, overlooking the city of Jaipur."
            }
        ]
    },
    {
        id: "agra",
        latitude: 27.1767,
        longitude: 78.0081,
        name: "Agra",
        country: "India",
        category: "historical",
        description: "Home to the Taj Mahal, one of the Seven Wonders of the World, and a testament to eternal love.",
        image: "https://upload.wikimedia.org/wikipedia/commons/d/da/Taj-Mahal.jpg",
        price: "₹10,000",
        placesToVisit: [
            {
                name: "Taj Mahal",
                image: "https://upload.wikimedia.org/wikipedia/commons/d/da/Taj-Mahal.jpg",
                description: "An ivory-white marble mausoleum on the right bank of the river Yamuna."
            },
            {
                name: "Agra Fort",
                image: "https://upload.wikimedia.org/wikipedia/commons/3/3f/Agra_Fort_1.jpg",
                description: "A historical fort in the city of Agra, also known as the Red Fort of Agra."
            },
            {
                name: "Fatehpur Sikri",
                image: "https://upload.wikimedia.org/wikipedia/commons/5/50/Fatehpur_Sikri_Panch_Mahal.jpg",
                description: "A town in the Agra District famed for its royal palaces and Jama Masjid."
            },
            {
                name: "Mehtab Bagh",
                image: "https://upload.wikimedia.org/wikipedia/commons/d/dd/Mehtab_Bagh.jpg",
                description: "A charbagh complex located north of the Taj Mahal complex."
            },
            {
                name: "Itmad-ud-Daulah",
                image: "https://upload.wikimedia.org/wikipedia/commons/f/f6/Itmad-Ud-Daulah%27s_Tomb.jpg",
                description: "A Mughal mausoleum often described as a 'jewel box', sometimes called the 'Baby Taj'."
            }
        ]
    },
    {
        id: "hampi",
        latitude: 15.3350,
        longitude: 76.4600,
        name: "Hampi",
        country: "India",
        category: "historical",
        description: "A UNESCO World Heritage Site located in east-central Karnataka, known for its ancient ruins.",
        image: "https://upload.wikimedia.org/wikipedia/commons/4/4b/Hampi_virupaksha_temple.jpg",
        price: "₹14,000",
        placesToVisit: [
            {
                name: "Virupaksha Temple",
                image: "https://upload.wikimedia.org/wikipedia/commons/4/4b/Hampi_virupaksha_temple.jpg",
                description: "The main center of pilgrimage at Hampi and has been considered the most sacred sanctuary."
            },
            {
                name: "Vittala Temple",
                image: "https://upload.wikimedia.org/wikipedia/commons/c/ca/Stone_Chariot_Hampi.jpg",
                description: "Known for its exceptional architecture and the famous stone chariot."
            },
            {
                name: "Hampi Bazaar",
                image: "https://commons.wikimedia.org/wiki/Special:FilePath/Hampi_Bazaar.jpg",
                description: "A unique feature of Hampi, a street stretching in front of the Virupaksha temple."
            },
            {
                name: "Elephant Stables",
                 image:"https://s7ap1.scene7.com/is/image/incredibleindia/elephant-stable-hampi-karnataka-3-attr-hero?qlt=82&ts=1726721346689",
                description: "A long building with a row of domed chambers which were used to 'park' the royal elephants."
            },
            {
                name: "Matanga Hill",
                 image:"https://thewandertherapy.com/wp-content/uploads/2024/10/24.matanga-hill-hampi-the-wander-therapy.jpg",
                description: "The highest point in Hampi offering the best view of the entire landscape."
            }
        ]
    },

    // India - Religious & Spiritual
    {
        id: "varanasi",
        latitude: 25.3176,
        longitude: 82.9739,
        name: "Varanasi",
        country: "India",
        category: "religious",
        description: "The spiritual capital of India, one of the oldest living cities in the world.",
        image: "https://upload.wikimedia.org/wikipedia/commons/2/2b/Varanasi_Ghats.jpg",
        price: "₹8,000",
        placesToVisit: [
            {
                name: "Kashi Vishwanath Temple",
                image:"https://www.amritara.co.in/_next/image?url=https%3A%2F%2Famritaracms.cinuniverse.com%2Fimg%2Fpost%2Fimage_2025-03-12-07-44-13_67d13b4d87593.jpg&w=1920&q=75",
                description: "One of the most famous Hindu temples dedicated to Lord Shiva."
            },
            {
                name: "Dashashwamedh Ghat",
               image:"https://www.varanasiguru.com/wp-content/uploads/2021/03/Dashashwamedh-Ghat.jpg",
                description: "The main ghat on the Ganga River, famous for the evening Ganga Aarti."
            },
            {
                name: "Assi Ghat",
                image: "https://upload.wikimedia.org/wikipedia/commons/3/37/Assi_Ghat_Varanasi.jpg",
                description: "A popular spot for long-term students, researchers, and tourists."
            },
            {
                name: "Sarnath",
               image:"https://www.agoda.com/wp-content/uploads/2023/10/3-Dhamekh-Stupa-Sarnath-India-Buddhist-Circuit.jpg",
                description: "Where Gautama Buddha first taught the Dharma."
            },
            {
                name: "Manikarnika Ghat",
                image:"https://cdn.getyourguide.com/img/tour/507d9e404184eab54fc7b3c583cac6c5384d5128eb651a66e03174323fb77d15.jpeg/145.jpg",
                description: "The primary cremation ghat in Varanasi, implying the cycle of life and death."
            }
        ]
    },
    {
        id: "amritsar",
        latitude: 31.6340,
        longitude: 74.8723,
        name: "Amritsar",
        country: "India",
        category: "religious",
        description: "Home to the Golden Temple, the holiest Gurdwara of Sikhism.",
        image: "https://upload.wikimedia.org/wikipedia/commons/8/86/Golden_Temple%2C_Amritsar_2022.jpg",
        price: "₹11,000",
        placesToVisit: [
            {
                name: "Golden Temple",
                image: "https://upload.wikimedia.org/wikipedia/commons/8/86/Golden_Temple%2C_Amritsar_2022.jpg",
                description: "The most sacred site of Sikhism, also known as Harmandir Sahib."
            },
            {
                name: "Jallianwala Bagh",
                 image:"https://s7ap1.scene7.com/is/image/incredibleindia/jallianwala-bagh-amritsar-punjab-1-attr-hero?qlt=82&ts=1726662275638",
                description: "A historic garden and memorial of national importance."
            },
            {
                name: "Wagah Border",
              image:"https://www.trawell.in/admin/images/upload/597529728Amritsar_Wagah_Border_Main.jpg",
                description: "Famous for the daily Beating Retreat ceremony between India and Pakistan."
            },
            {
                name: "Partition Museum",
               image:"https://assets.bwbx.io/images/users/iqjWHBFdfxIU/i_is2hSgAWMI/v0/-1x-1.webp",
                description: "The world's first museum dedicated to the Partition of 1947."
            },
            {
                name: "Gobindgarh Fort",
                image: "https://upload.wikimedia.org/wikipedia/commons/7/74/Gobindgarh_Fort.jpg",
                description: "A historic military fort with museums and light shows."
            }
        ]
    },
    {
        id: "tirupati",
        latitude: 13.6288,
        longitude: 79.4192,
        name: "Tirupati",
        country: "India",
        category: "religious",
        description: "Famous for the Sri Venkateswara Temple, one of the richest and most visited religious sites.",
        image: "https://upload.wikimedia.org/wikipedia/commons/f/fb/Venkateshwara_Tirupati_Temple.jpg",
        price: "₹9,000",
        placesToVisit: [
            {
                name: "Sri Venkateswara Temple",
                image: "https://upload.wikimedia.org/wikipedia/commons/f/fb/Venkateshwara_Tirupati_Temple.jpg",
                description: "A landmark Vaishnavite temple dedicated to Lord Venkateswara."
            },
            {
                name: "Kapila Theertham",
               image:"https://avathioutdoors.gumlet.io/travelGuide/dev/tirupati_P1121.jpg",
                description: "A famous Saivite temple and holy water spring at the foot of Tirumala Hills."
            },
            {
                name: "Talakona Waterfalls",
               image:"https://upload.wikimedia.org/wikipedia/commons/thumb/7/77/Talakona_Waterfalls_near_Tirupati_India.jpg/250px-Talakona_Waterfalls_near_Tirupati_India.jpg",
                description: "The highest waterfall in the Andhra Pradesh state."
            },
            {
                name: "Chandragiri Fort",
               image:"https://s7ap1.scene7.com/is/image/incredibleindia/chandragiri-fort-tirupati-andhra-pradesh-1-new-attr-hero?qlt=82&ts=1742149835282",
                description: "A historical fort dating back to the 11th century."
            },
            {
                name: "TTD Gardens",
                image:"https://content.jdmagicbox.com/comp/tirupati/j8/9999px877.x877.141218185212.u5j8/catalogue/ttd-gardens-tirupathi-ho-tirupati-parks-0080cml.jpg",
                description: "Ornamental, landscape and flower gardens supplying flowers to the temples."
            }
        ]
    },

    // India - Hill Stations & Mountains
    {
        id: "manali",
        latitude: 32.2432,
        longitude: 77.1892,
        name: "Manali",
        country: "India",
        category: "mountain",
        description: "A high-altitude Himalayan resort town famous for backpacking and honeymooning.",
        image: "https://upload.wikimedia.org/wikipedia/commons/e/e0/Hadimba_temple_manali.jpg",
        price: "₹18,000",
        placesToVisit: [
            {
                name: "Hadimba Temple",
                image: "https://upload.wikimedia.org/wikipedia/commons/e/e0/Hadimba_temple_manali.jpg",
                description: "An ancient cave temple dedicated to Hidimbi Devi, wife of Bhima."
            },
            {
                name: "Solang Valley",
                image:"https://upload.wikimedia.org/wikipedia/commons/f/f1/Solang_Valley_%2CManali%2C_Himachal_Pardes%2C_India.JPG",
                description: "Famous for adventure sports like parachuting, paragliding, skating and zorbing."
            },
            {
                name: "Rohtang Pass",
                image: "https://upload.wikimedia.org/wikipedia/commons/1/12/Rohtang_Pass.jpg",
                description: "A high mountain pass on the eastern end of the Pir Panjal Range."
            },
            {
                name: "Old Manali",
                image: "https://upload.wikimedia.org/wikipedia/commons/6/66/Old_Manali.jpg",
                description: "A backpacker paradise with cafes, small shops and a chilled vibe."
            },
            {
                name: "Jogini Waterfall",
                image: "https://upload.wikimedia.org/wikipedia/commons/d/dd/Jogini_Falls.jpg",
                description: "A beautiful waterfall with a stream running down to join the river Beas."
            }
        ]
    },
    {
        id: "shimla",
        latitude: 31.1048,
        longitude: 77.1734,
        name: "Shimla",
        country: "India",
        category: "mountain",
        description: "The capital of Himachal Pradesh, known for its colonial architecture and mall road.",
        image: "https://upload.wikimedia.org/wikipedia/commons/f/f9/Shimla_Ridge.jpg",
        price: "₹15,000",
        placesToVisit: [
            {
                name: "The Ridge",
                image: "https://upload.wikimedia.org/wikipedia/commons/f/f9/Shimla_Ridge.jpg",
                description: "A large open space in the center of Shimla, the hub of all cultural activities."
            },
            {
                name: "Mall Road",
                 image:"https://discoverkullumanali.in/wp-content/uploads/2020/01/Aerial-view-of-mall-road-of-Manali-town.jpg",
                description: "The main street in Shimla, constructed during British colonial rule."
            },
            {
                name: "Jakhu Temple",
                image: "https://upload.wikimedia.org/wikipedia/commons/5/50/Jakhu_Temple_Shimla.jpg",
                description: "An ancient temple in Shimla, dedicated to the Hindu deity Hanuman."
            },
            {
                name: "Kalka-Shimla Railway",
               image:"https://dynamic-media-cdn.tripadvisor.com/media/photo-o/19/fe/c9/77/photo0jpg.jpg?w=1200&h=-1&s=1",
                description: "A UNESCO World Heritage Site, this toy train offers a scenic journey."
            },
            {
                name: "Christ Church",
                image: "https://upload.wikimedia.org/wikipedia/commons/f/f2/Christ_Church_Shimla.jpg",
                description: "The second oldest church in North India, known for its neo-Gothic architecture."
            }
        ]
    },
    {
        id: "ladakh",
        latitude: 34.1526,
        longitude: 77.5770,
        name: "Ladakh",
        country: "India",
        category: "mountain",
        description: "A region in Indian Himalayas, known for its stark landscapes and Buddhist monasteries.",
       image:"https://i0.wp.com/lahimalaya.com/wp-content/uploads/2019/08/Ladakh-trip.jpg?fit=960%2C640&ssl=1",
        price: "₹30,000",
        placesToVisit: [
            {
                name: "Pangong Lake",
                image:"https://static.toiimg.com/photo/msid-79549873,width-96,height-65.cms",
                description: "A high grassland lake, famous for its changing colors."
            },
            {
                name: "Nubra Valley",
                 image:"https://endeavorladakh.com/wp-content/uploads/2025/08/Nubra-Valley-Ladakh.jpg",
                description: "Known for its orchards, scenic vistas, Bactrian camels and monasteries."
            },
            {
                name: "Thiksey Monastery",
                image: "https://upload.wikimedia.org/wikipedia/commons/f/f2/Thiksey_Monastery.jpg",
                description: "A gompa affiliated with the Gelug sect of Tibetan Buddhism."
            },
            {
                name: "Magnetic Hill",
                 image:"https://goldenwheels.in/wp-content/uploads/2024/11/magnetic-hill_leh_golden_wheels-1.png",
                description: "A gravity hill located near Leh."
            },
            {
                name: "Shanti Stupa",
                image:"https://s7ap1.scene7.com/is/image/incredibleindia/shanti-stupa-leh-ladakh-1-attr-hero?qlt=82&ts=1726667857753",
                description: "A Buddhist white-domed stupa on a hilltop in Chanspa."
            }
        ]
    },

    // India - Beaches & Coastal
    {
        id: "goa",
        latitude: 15.4909,
        longitude: 73.8278,
        name: "Goa",
        country: "India",
        category: "beach",
        description: "Famous for its pristine beaches, vibrant nightlife, and Portuguese heritage.",
        image:"https://dynamic-media-cdn.tripadvisor.com/media/photo-o/15/33/fc/f0/goa.jpg?w=1200&h=700&s=1",
        price: "₹15,000",
        placesToVisit: [
            {
                name: "Baga Beach",
               image:"https://dynamic-media-cdn.tripadvisor.com/media/photo-o/18/3e/36/95/baga-sea-beach.jpg?w=800&h=-1&s=1",
                description: "One of the most popular beaches in North Goa, known for water sports and nightlife."
            },
            {
                name: "Fort Aguada",
               image:"https://www.fabhotels.com/blog/wp-content/uploads/2019/06/Aguada-Fort_600.jpg",
                description: "A 17th-century Portuguese fort and lighthouse overlooking the Arabian Sea."
            },
            {
                name: "Dudhsagar Falls",
                image:"https://res.klook.com/images/w_1200,h_630,c_fill,q_65/w_80,x_15,y_15,g_south_west,l_Klook_water_br_trans_yhcmh3/activities/p0vxsq830pa8famawc4f/Dudhsagar:WaterfallJeepSafariDayTrip-KlookIndia.jpg",
                description: "A majestic four-tiered waterfall located on the Mandovi River."
            },
            {
                name: "Basilica of Bom Jesus",
                image: "https://upload.wikimedia.org/wikipedia/commons/9/98/Basilica_of_Bom_Jesus.jpg",
                description: "A UNESCO World Heritage Site holding the mortal remains of St. Francis Xavier."
            },
            {
                name: "Calangute Beach",
               image:"https://s7ap1.scene7.com/is/image/incredibleindia/calangute-beach-goa-7-musthead-hero?qlt=82&ts=1742168166188",
                description: "Known as the 'Queen of Beaches', it's the largest beach in North Goa."
            }
        ]
    },
    {
        id: "andaman",
        latitude: 11.6234,
        longitude: 92.7265,
        name: "Andaman Islands",
        country: "India",
        category: "beach",
        description: "An archipelago for its white-sand beaches, mangroves and tropical rainforests.",
        image: "https://upload.wikimedia.org/wikipedia/commons/8/84/Radhanagar_Beach_Havelock.jpg",
        price: "₹40,000",
        placesToVisit: [
            {
                name: "Radhanagar Beach",
                image: "https://upload.wikimedia.org/wikipedia/commons/8/84/Radhanagar_Beach_Havelock.jpg",
                description: "Ranked as one of the best beaches in Asia, known for its stunning sunset."
            },
            {
                name: "Cellular Jail",
                 image:"https://images.assettype.com/nationalherald/2020-08/dbcc7f7f-e8cf-49f6-a932-a648c12376fd/cellular_jail.jpg",
                description: "A colonial prison in the Andaman and Nicobar Islands, now a national memorial monument."
            },
            {
                name: "Ross Island",
                image: "https://upload.wikimedia.org/wikipedia/commons/5/55/Ross_Island_Andaman.jpg",
                description: "Known for the ruins of the British colonial past."
            },
            {
                name: "Elephant Beach",
              image:"https://www.havelockislandbeachresort.com/storage/havelock-island-1-1.png",
                description: "Famous for coral reefs and water sports activities like snorkeling."
            },
            {
                name: "Baratang Island",
               image:"https://www.industraveller.com/wp-content/uploads/2019/05/honeymoon-packages-havelock-island.jpg",
                description: "Known for the mud volcanoes and limestone caves."
            }
        ]
    },
    {
        id: "gokarna",
        latitude: 14.5479,
        longitude: 74.3188,
        name: "Gokarna",
        country: "India",
        category: "beach",
        description: "A town on the Arabian Sea, known for its sacred Mahabaleshwar Temple and beaches.",
        image: "https://upload.wikimedia.org/wikipedia/commons/c/c2/Om_Beach_Gokarna.jpg",
        price: "₹12,000",
        placesToVisit: [
            {
                name: "Om Beach",
                image: "https://upload.wikimedia.org/wikipedia/commons/c/c2/Om_Beach_Gokarna.jpg",
                description: "Named after the Hindu symbol 'Om', which its shape resembles."
            },
            {
                name: "Mahabaleshwar Temple",
              image:"https://hblimg.mmtcdn.com/content/hubble/img/Mahabaleshwar/mmt/activities/m_activities_mahabaleshwar_temple_l_556_832.jpg",
                description: "A 4th-century CE Hindu temple dedicated to Lord Shiva."
            },
            {
                name: "Kudle Beach",
                image:"https://gokarnatourism.co.in/images/places-to-visit/header/kudle-beach-gokarna-indian-tourism-entry-fee-timings-holidays-reviews-header.jpg",
                description: "One of the most popular beaches in Gokarna, perfect for swimming."
            },
            {
                name: "Paradise Beach",
               image:"https://simbaseatrips.com/wp-content/uploads/2023/07/paradise-beach-featured.jpg",
                description: "A secluded beach accessible only by boat or hiking."
            },
            {
                name: "Half Moon Beach",
                image:"https://kalavadyfarmstay.com/wp-content/uploads/2023/02/Half_Moon_Beach.jpg",
                description: "A small, beautiful beach shaped like a half-moon."
            }
        ]
    },

    // India - Nature & Wildlife
    {
        id: "kerala",
        latitude: 9.4981,
        longitude: 76.3388,
        name: "Kerala",
        country: "India",
        category: "nature",
        description: "God's Own Country, offering serene backwaters, lush greenery, and ayurveda.",
        image: "https://commons.wikimedia.org/wiki/Special:FilePath/Kerala_Backwaters_Alleppey.jpg",
        price: "₹20,000",
        placesToVisit: [
            {
                name: "Alleppey Backwaters",
                image: "https://commons.wikimedia.org/wiki/Special:FilePath/Kerala_Backwaters_Alleppey.jpg",
                description: "Famous for its houseboat cruises along the rustic Kerala backwaters."
            },
            {
                name: "Munnar",
                image: "https://upload.wikimedia.org/wikipedia/commons/0/0d/Munnar_Tea_Plantations.jpg",
                description: "A hill station famous for its tea plantations and misty mountains."
            },
            {
                name: "Periyar National Park",
                image: "https://upload.wikimedia.org/wikipedia/commons/6/68/Periyar_National_Park.jpg",
                description: "A protected area known for its elephants and scenic lake."
            },
            {
                name: "Kochi",
                image: "https://commons.wikimedia.org/wiki/Special:FilePath/Chinese_Fishing_Nets_Kochi.jpg",
                description: "Explore the colonial architecture and Chinese fishing nets."
            },
            {
                name: "Varkala Beach",
                image: "https://upload.wikimedia.org/wikipedia/commons/2/2a/Varkala_Beach.jpg",
                description: "Known for the dramatic red cliffs adjacent to the Arabian Sea."
            }
        ]
    },
    {
        id: "jim-corbett",
        latitude: 29.3919,
        longitude: 79.1318,
        name: "Jim Corbett",
        country: "India",
        category: "nature",
        description: "India's oldest national park, famous for its Bengal tigers and diverse wildlife.",
        image: "https://commons.wikimedia.org/wiki/Special:FilePath/Jim_Corbett_National_Park_Tiger.jpg",
        price: "₹16,000",
        placesToVisit: [
            {
                name: "Jungle Safari",
                image: "https://commons.wikimedia.org/wiki/Special:FilePath/Jim_Corbett_National_Park_Tiger.jpg",
                description: "Experience the thrill of spotting tigers in their natural habitat."
            },
            {
                name: "Kosi River",
                image: "https://commons.wikimedia.org/wiki/Special:FilePath/Kosi_River_Ramnagar.jpg",
                description: "A perennial river famous for fishing and scenic beauty."
            },
            {
                name: "Corbett Waterfall",
                image: "https://upload.wikimedia.org/wikipedia/commons/1/18/Corbett_Falls.jpg",
                description: "A scenic waterfall surrounded by dense teak wood forest."
            },
            {
                name: "Garjiya Devi Temple",
                image: "https://commons.wikimedia.org/wiki/Special:FilePath/Garjiya_Devi_Temple.jpg",
                description: "A famous Devi temple located in the Garjiya village near Ramnagar."
            },
            {
                name: "Corbett Museum",
                image: "https://commons.wikimedia.org/wiki/Special:FilePath/Corbett_Museum.jpg",
                description: "A heritage bungalow of Edward James Jim Corbett."
            }
        ]
    },
    {
        id: "kaziranga",
        latitude: 26.5775,
        longitude: 93.1711,
        name: "Kaziranga",
        country: "India",
        category: "nature",
        description: "A World Heritage Site, hosting two-thirds of the world's great one-horned rhinoceroses.",
        image: "https://commons.wikimedia.org/wiki/Special:FilePath/Kaziranga_National_Park_Rhino.jpg",
        price: "₹25,000",
        placesToVisit: [
            {
                name: "Elephant Safari",
                image: "https://commons.wikimedia.org/wiki/Special:FilePath/Kaziranga_National_Park_Rhino.jpg",
                description: "Best way to explore the park and spot majestic rhinos."
            },
            {
                name: "Orchid and Biodiversity Park",
                image: "https://commons.wikimedia.org/wiki/Special:FilePath/Orchid_Park_Kaziranga.jpg",
                description: "Displays a wide variety of wild orchids collected from the region."
            },
            {
                name: "Tea Gardens",
                image: "https://commons.wikimedia.org/wiki/Special:FilePath/Assam_Tea_Garden.jpg",
                description: "Walk through the lush green tea gardens of Assam."
            },
            {
                name: "Kaziranga National Orchid Park",
                image: "https://commons.wikimedia.org/wiki/Special:FilePath/Kaziranga_Orchid_Park.jpg",
                description: "A great place to see cultural dances and local flora."
            },
            {
                name: "Hollongapar Gibbon Sanctuary",
                image: "https://upload.wikimedia.org/wikipedia/commons/7/73/Hoolock_Gibbon.jpg",
                description: "An isolated protected area of evergreen forest known for Hoolock Gibbons."
            }
        ]
    },


    // International
    {
        id: "paris",
        latitude: 48.8566,
        longitude: 2.3522,
        name: "Paris",
        country: "International",
        category: "city",
        description: "The City of Light, famous for the Eiffel Tower, art, and gastronomy.",
        image: "https://upload.wikimedia.org/wikipedia/commons/a/a8/Tour_Eiffel_Wikimedia_Commons.jpg",
        price: "₹1,50,000",
        placesToVisit: [
            {
                name: "Eiffel Tower",
                image: "https://upload.wikimedia.org/wikipedia/commons/a/a8/Tour_Eiffel_Wikimedia_Commons.jpg",
                description: "The global icon of France and one of the most recognizable structures in the world."
            },
            {
                name: "Louvre Museum",
                // image: "https://upload.wikimedia.org/wikipedia/commons/6/66/Louvre_Museum_Wikimedia_Commons.jpg",
                image:"https://www.franceguide.info/wp-content/uploads/sites/18/paris-louvre-pyramid-hd.jpg",
                description: "The world's largest art museum and a historic monument in Paris."
            },
            {
                name: "Arc de Triomphe",
                image: "https://upload.wikimedia.org/wikipedia/commons/c/c4/Arc_Triomphe.jpg",
                description: "One of the most famous monuments in Paris, standing at the western end of the Champs-Élysées."
            },
            {
                name: "Notre-Dame Cathedral",
              image:"https://www.frasershospitality.com/en/locations/france/paris/fraser-suites-le-claridge-champs-elysees-paris/city-guide/notre-dame-cathedral-a-symbol-of-resilience-and-rebirth/_jcr_content/root/container/column_controller/column-1-wrapper/image_201548793_copy.coreimg.jpeg/1734451807962/notre-dame-being-rebuilt.jpeg",
                description: "A medieval Catholic cathedral on the Île de la Cité."
            },
            {
                name: "Montmartre",
                image: "https://upload.wikimedia.org/wikipedia/commons/8/8d/Sacre_Coeur_Montmartre.jpg",
                description: "A large hill in Paris's 18th arrondissement, known for its artistic history."
            }
        ]
    },
    {
        id: "tokyo",
        latitude: 35.6762,
        longitude: 139.6503,
        name: "Tokyo",
        country: "International",
        category: "city",
        description: "A bustling metropolis mixing ultramodern neon with traditional temples.",
        image: "https://upload.wikimedia.org/wikipedia/commons/b/b2/Skyscrapers_of_Shinjuku_2009_January.jpg",
        price: "₹1,80,000",
        placesToVisit: [
            {
                name: "Senso-ji Temple",
                image:"https://cdn.cheapoguides.com/wp-content/uploads/sites/2/2020/05/sensoji-temple-iStock-1083328636-1024x600.jpg",
                description: "Tokyo's oldest temple, located in Asakusa."
            },
            {
                name: "Shibuya Crossing",
               image:"https://as1.ftcdn.net/v2/jpg/01/27/56/66/1000_F_127566600_Am95Uk2KSH51ykzk5syVYr43kt725BZ5.jpg",
                description: "The world's busiest pedestrian crossing."
            },
            {
                name: "Tokyo Skytree",
                 image:"https://upload.wikimedia.org/wikipedia/commons/8/84/Tokyo_Skytree_2014_%E2%85%A2.jpg",
                description: "A broadcasting and observation tower, creating the skyline of Tokyo."
            },
            {
                name: "Meiji Shrine",
                image: "https://upload.wikimedia.org/wikipedia/commons/0/05/Meiji_Jingu_Shrine.jpg",
                description: "Shinto shrine dedicated to Emperor Meiji and his wife."
            },
            {
                name: "Akihabara",
                image: "https://upload.wikimedia.org/wikipedia/commons/9/97/Akihabara_Electric_Town.jpg",
                description: "Famous for its many electronics shops and anime culture."
            }
        ]
    },
    {
        id: "bali",
        latitude: -8.4095,
        longitude: 115.1889,
        name: "Bali",
        country: "International",
        category: "beach",
        description: "An island paradise known for its forested volcanic mountains and beaches.",
        image: "https://upload.wikimedia.org/wikipedia/commons/7/7f/Ulun_Danu_Beratan_Temple.jpg",
        price: "₹60,000",
        placesToVisit: [
            {
                name: "Uluwatu Temple",
                image:"https://yachtsourcing.com/wp-content/uploads/DJI_0377_1300.jpg",
                description: "A Balinese sea temple perched on a steep cliff."
            },
            {
                name: "Ubud Monkey Forest",
           image:"https://monkeyforestubud.com/wp-content/uploads/2023/09/banner-4-1.jpg?x16351",
                description: "A sanctuary and natural habitat of the Balinese long-tailed monkey."
            },
            {
                name: "Tegalalang Rice Terrace",
                 image:"https://cdn.prod.website-files.com/66fab24d6dde4d79b3b50865/67de721a9834260c076e97be_Tegallalang%20Rice%20Terraces.webp",
                description: "Famous for its beautiful scenes of rice paddies involving the subak system."
            },
            {
                name: "Tanah Lot",
                image: "https://upload.wikimedia.org/wikipedia/commons/1/1f/Tanah_Lot_Bali.jpg",
                description: "A rock formation home to the ancient Hindu pilgrimage temple Pura Tanah Lot."
            },
            {
                name: "Seminyak Beach",
                image:"https://dynamic-media-cdn.tripadvisor.com/media/photo-o/1b/4b/11/f0/the-seminyak-beach-resort.jpg?w=900&h=500&s=1",
                description: "A mixed tourist residential area on the west coast of Bali."
            }
        ]
    }
];
