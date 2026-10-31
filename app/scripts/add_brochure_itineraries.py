#!/usr/bin/env python3
"""Transcribe brochure day-by-day programmes into the travel catalogue.

Source of truth: Brochure.pdf (8 pages), OCR transcript in artifacts/brochure-ocr.txt.
Only content legible in the brochure is transcribed. Nothing is invented; where the
scan is partial or the brochure is internally inconsistent, a content_flag is added.

Idempotent: re-running replaces the itinerary/inclusions/exclusions keys rather than
appending duplicates.

Usage: python app/scripts/add_brochure_itineraries.py
"""

import json
import os
import shutil

ROOT = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
APP_CATALOGUE = os.path.join(ROOT, "app", "src", "data", "travel_packages_catalog.json")
ROOT_CATALOGUE = os.path.join(ROOT, "travel_packages_catalog.json")


def day(number, title, description):
    return {"day": number, "title": title, "description": description}


PROGRAMMES = {
    # ---------------------------------------------------------------- Stopovers
    "delhi-stopover": [
        day(1, "Delhi", "On arrival, check into your hotel for an overnight stay."),
        day(2, "Delhi", "Morning sightseeing tour of iconic landmarks: the Red Fort, Jama Masjid and Gandhi Samadhi, alongside a drive past India Gate and the President's House. Afternoon exploring local manufacturers, wholesalers and markets."),
        day(3, "Delhi", "Transfer to the airport, or join another tour."),
    ],
    "bombay-stopover": [
        day(1, "Mumbai", "Meet your representative and transfer to your hotel, followed by an afternoon city tour."),
        day(2, "Elephanta Caves", "Morning excursion to the Elephanta Caves."),
        day(3, "Bollywood", "Full-day tour exploring Bollywood, the world's largest film studios."),
        day(4, "Mumbai", "Transfer to your onward destination."),
    ],
    "discover-leh": [
        day(1, "Leh", "Arrive at Leh and rest."),
        day(2, "Leh", "Leh local sightseeing."),
        day(3, "Leh", "Local sightseeing."),
        day(4, "Leh", "Onwards journey, departure/transfer."),
    ],
    "kathmandu-stopover": [
        day(1, "Kathmandu", "You will be met and transferred to your hotel."),
        day(2, "Kathmandu", "Morning city sightseeing tour."),
        day(3, "Kathmandu", "Day at leisure, optional flight to Everest base camp."),
        day(4, "Kathmandu", "Departure/transfer."),
    ],
    "kathmandu-pokhara": [
        day(1, "Kathmandu / Pokhara", "Travel by car to Pokhara (203 kms)."),
        day(2, "Pokhara", "Day at leisure."),
        day(3, "Pokhara / Kathmandu", "Transfer for your first flight to Kathmandu and transfer on arrival to hotel."),
        day(4, "Kathmandu", "Departure. Hotel check out time is 12."),
    ],
    "discover-ladakh": [
        day(1, "Leh / Nubra Valley", "Leh to Nubra Valley via Khardung La."),
        day(2, "Nubra / Turtuk", "Nubra to Turtuk."),
        day(3, "Nubra Valley / Pangong", "Nubra Valley to Pangong."),
        day(4, "Pangong / Leh", "Pangong to Leh."),
        day(5, "Leh", "Departure/transfer."),
    ],
    # ------------------------------------------------------------ Images of India
    "golden-triangle": [
        day(1, "Delhi – Agra", "Drive to Agra; visit the Taj Mahal and Agra Fort."),
        day(2, "Agra – Jaipur", "Visit Fatehpur Sikri; drive via Bharatpur Bird Sanctuary to Jaipur."),
        day("03–04", "Jaipur – Delhi", "Jaipur city tour, leisure time and Amber Fort excursion; drive to Delhi."),
    ],
    "glorious-goa-stopover": [
        day(1, "Goa", "Arrival, meet and greet; hotel transfer, leisure."),
        day("02–04", "Goa", "Panjim city tour; remaining time at leisure."),
    ],
    "glimpses-of-kerala": [
        day(1, "Trivandrum", "Arrival, hotel transfer; leisure."),
        day(2, "Kovalam", "Morning at leisure; afternoon Trivandrum city tour."),
        day("03–04", "Kovalam – Periyar – Cochin", "Drive to Periyar; lake wildlife cruise. Proceed via Kottayam and Alleppey, with backwater cruise, to Cochin."),
        day("05–06", "Cochin", "Backwater cruise, city tour and Kathakali dance; check-out by 12 noon on Day 6."),
    ],
    "kashmir-package-7-day": [
        day(1, "Delhi / Srinagar", "On arrival in Srinagar. Meet at airport and transfer to a deluxe house boat for overnight in the house boat."),
        day(2, "Srinagar / Gulmarg", "Morning half-day city tour of the old part of Srinagar. After noon at leisure, overnight house boat."),
        day(3, "Srinagar / Sonmarg", "After breakfast, proceed to Sonmarg, the meadow of gold, and enjoy its scenic beauty. Spend the day exploring the local area, with an optional pony ride or trek to the glacier. Return to Srinagar overnight at the house boat."),
        day(4, "Mughal Garden & Shikara Tour", "After breakfast, visit Shankaracharya hill for a bird's-eye view of Srinagar. Visit the Mughal gardens, Nishat and Shalimar. After lunch, a shikara ride. Overnight in the house boat."),
        day(5, "Srinagar / Pahalgam", "After breakfast, drive to Pahalgam and enjoy the day strolling along the Lidder River, or an optional horse ride or trek. Return to Srinagar in the evening, overnight in the house boat."),
        day(6, "Srinagar / Gulmarg", "After breakfast, drive to Gulmarg, the meadow of flowers. On arrival at the hill top, the option of horse riding, golf or trekking. All activities are optional. Overnight at the house boat in Srinagar."),
    ],
    "kashmir-package-4-day": [
        day(1, "Srinagar", "Reception at Srinagar and transfer to M.S. Baktoo group of houseboats. After lunch, a shikara cruise to the Floating Gardens."),
        day(2, "Srinagar", "Sightseeing tour of the old and new parts of Srinagar city, visiting the mosques, tombs and handicraft centres."),
        day(3, "Srinagar", "Day trip to the mountain resort of Pahalgam, Gulmarg or Sonmarg — only one of the three — with optional horse riding for one hour. Return for dinner on the houseboat."),
        day(4, "Srinagar", "Early morning visit to the floating vegetable market by shikara; after breakfast, transfer to the airport or bus terminal for departure. For passengers arriving by bus, a shikara cruise will be on day 2."),
    ],
    "delhi-to-kathmandu": [
        day(1, "Delhi / Agra", "Transfer to Agra; on arrival transfer to hotel. Afternoon sightseeing tour of the Taj Mahal."),
        day(2, "Agra / Varanasi", "Transfer to the railway station for your train journey to Varanasi. Upon arrival, transfer to the hotel. Afternoon at leisure."),
        day(3, "Varanasi", "Afternoon activity."),
        day(4, "Varanasi", "Early morning boat tour on River Ganges. Afternoon at leisure."),
        day(5, "Varanasi / Kathmandu", "Transfer for flight to Kathmandu and transfer to hotel. Afternoon sightseeing tour of city."),
        day(6, "Kathmandu", "Morning city sightseeing tour; afternoon at leisure."),
        day(7, "Kathmandu", "Day at leisure, optional flight to Everest base camp."),
        day(8, "Kathmandu", "Hotel check out time is 12 Noon. Departure / transfer."),
    ],
    "heritage-tour-india": [
        day(1, "Delhi", "Arrive in Delhi, meet your guide, transfer to your accommodation and relax."),
        day(2, "Delhi", "Explore Old and New Delhi, including Humayun's Tomb, Jantar Mantar, Qutub Minar, India Gate and Raj Ghat. Enjoy the Sound and Light Show at Red Fort."),
        day(3, "Delhi – Mandawa", "Drive to Rajasthan's Shekhawati region and discover Mandawa's historic havelis and colourful streets."),
        day(4, "Mandawa – Bikaner", "Travel to Bikaner and visit Junagarh Fort and a camel-breeding farm."),
        day(5, "Bikaner – Jaisalmer", "Drive to the golden desert city of Jaisalmer and enjoy its unique atmosphere."),
        day(6, "Jaisalmer", "Explore the city's famous havelis and visit the Sam Sand Dunes for spectacular desert views."),
        day(7, "Jaisalmer – Jodhpur", "Travel to Jodhpur and explore the magnificent Mehrangarh Fort and its museum."),
        day(8, "Jodhpur – Udaipur", "Drive to romantic Udaipur and visit the grand City Palace Museum."),
        day(9, "Udaipur", "Enjoy leisure time around Lake Pichola and explore the city's beautiful temples, palaces and cultural attractions."),
        day(10, "Udaipur – Jaipur", "Travel to Jaipur, Rajasthan's famous Pink City, and enjoy time at leisure."),
        day(11, "Jaipur", "Visit Amber Fort, City Palace, Hawa Mahal and Jantar Mantar, showcasing Rajasthan's royal heritage and architecture."),
        day(12, "Jaipur – Agra", "Drive to Agra via Fatehpur Sikri, the historic abandoned Mughal city. Visit the world-famous Taj Mahal."),
        day(13, "Agra – Delhi", "Enjoy a morning sightseeing tour of Agra before returning to Delhi."),
        day(14, "Delhi", "Transfer for your onward or homeward journey."),
    ],
    "north-india-highlights": [
        day(1, "Delhi", "Arrival transfer in Delhi."),
        day(2, "Delhi", "Morning city sightseeing tour."),
        day(3, "Delhi / Agra", "Transfer for train to Agra on arrival transfer to hotel. Afternoon city sightseeing tour."),
        day(4, "Agra / Jaipur", "Transfer for train to Jaipur. Arrival transfer to hotel."),
        day(5, "Jaipur", "Morning sightseeing tour."),
        day(6, "Jaipur / Udaipur", "Transfer for flight to Udaipur. Arrival transfer to hotel."),
        day(7, "Udaipur", "Morning city sightseeing tour."),
        day(8, "Udaipur / Delhi", "Transfer for flight to Delhi. Arrival transfer to hotel."),
        day(9, "Delhi / Srinagar", "Transfer for flight to Srinagar. Arrival transfer to houseboat."),
        day(10, "Srinagar", "Shikara cruise on the lake."),
        day(11, "Srinagar", "Morning city sightseeing tour."),
        day(12, "Srinagar", "Day trip to mountain resort of Gulmarg, Pahalgham or Sonmarg — only one of the three."),
        day(13, "Srinagar", "At leisure."),
        day(14, "Srinagar / Leh", "Transfer for flight to Leh. Arrival transfer to hotel. Remaining day free, climatisation."),
        day(15, "Leh", "Full day trip of the monasteries."),
        day(16, "Leh", "Morning city tour."),
        day(17, "Leh / Delhi", "Transfer for flight to Delhi. Arrival transfer to hotel."),
        day(18, "Delhi", "At leisure."),
        day(19, "Delhi", "Fly to destination."),
    ],
    "india-nepal-combination": [
        day(1, "Delhi", "Meet upon arrival and transferred to hotel in Delhi."),
        day(2, "Delhi", "Full day sightseeing tour of Old and New Delhi."),
        day(3, "Delhi / Udaipur", "Transfer for flight to the romantic city of Udaipur in Rajasthan. Transfer to hotel."),
        day(4, "Udaipur", "Morning city sightseeing tour, visiting the temples and palaces of this cultural centre. Afternoon free to relax or take a boat ride to Pichola Lake."),
        day(5, "Udaipur / Jodhpur", "Transfer for flight to Jodhpur and met upon arrival and transferred to hotel."),
        day(6, "Jodhpur", "Morning city sightseeing tour visiting the imposing, battle scarred Fort and its fascinating museum."),
        day(7, "Jodhpur / Jaipur", "Transfer for flight to Jaipur. Met and transferred to hotel."),
        day(8, "Jaipur", "Morning city sightseeing tour visiting the elaborate City Palace and the Royal Observatory, Amber Fort."),
        day(9, "Jaipur / Agra", "By road to Agra via Fatehpur Sikri."),
        day(10, "Agra", "Morning city sightseeing tour of the Taj Mahal and Agra's Red Fort."),
        day(11, "Agra / Varanasi", "Transfer for onward travel to Varanasi."),
        day(12, "Varanasi", "Local sightseeing."),
        day(13, "Varanasi", "Morning tour to Sarnath. Afternoon city sightseeing tour."),
        day(14, "Varanasi / Kathmandu", "Early morning boat cruise. Transfer for flight to Kathmandu. Arrival transfer to hotel."),
        day(15, "Kathmandu", "Morning tour to Patan."),
        day(16, "Kathmandu", "Fly to destination."),
    ],
    "south-india-highlight": [
        day(1, "Kochi", "Arrival at Cochin Airport. Meet the representative and proceed for local sightseeing covering Mattancherry Palace, Fort Kochi and Chinese Fishing Nets. Overnight stay in Kochi."),
        day(2, "Kochi – Munnar", "Visit Athirapally Waterfalls, Cardamom Plantation, Spice Garden and Flower Garden."),
        day(3, "Munnar", "Local sightseeing: Eravikulam National Park, Tea Museum, Mattupetty Dam and Kundala Lake, Echo Point and Photo Point."),
        day(4, "Munnar – Thekkady", "Visit Periyar Wildlife Sanctuary, Elephant Junction and Kalaripayattu Show."),
        day(5, "Thekkady – Alleppey", "After breakfast, proceed to Alleppey and board the houseboat by 12:00 noon. Enjoy cruising through the backwaters. Lunch at 13:30 hrs, cruise resumes at 14:30 hrs, with tea and snacks onboard. Houseboat reaches the halt by 18:00 hrs. Overnight stay on the houseboat."),
        day(6, "Alleppey", "Alleppey Beach, Marari Beach, Alleppey Lighthouse and Alleppey Market."),
        day(7, "Alleppey – Varkala", "Visit Jatayu Earth Centre and Munroe Island."),
        day(8, "Varkala", "Local sightseeing: Varkala Beach, Kappil Beach, Varkala Cliff and Sree Janardhan Swamy Temple."),
        day(9, "Varkala – Kovalam", "Visit Hawah Beach, Samudra Beach, Kovalam Beach and Vizhinjam Lighthouse."),
        day(10, "Trivandrum", "Local sightseeing: Sree Padmanabha Swamy Temple, Azhimala Shiva Statue, Napier Museum, Sree Chithra Art Gallery and Trivandrum Zoo."),
        day(11, "Kovalam – Kanyakumari via Poovar", "Visit Poovar Island, Kumari Amman Temple, Vivekanand Memorial, Thiruvalluvar Statue and Triveni Sangam (sunset view)."),
        day(12, "Kanyakumari – Rameshwaram", "Visit Annai Indira Gandhi Pamban Bridge and Pamban Rail Scissors Bridge."),
        day(13, "Rameshwaram", "Sightseeing: Sri Arulmigu Ramanathaswamy Temple, Dhanushkodi Beach and Dhanushkodi, Dr. APJ Abdul Kalam Memorial, Sri Panchmukhi Hanuman Temple, Kodanda Ramar Temple and Rama Teertham."),
        day(14, "Rameshwaram – Madurai and departure", "Proceed to Madurai after breakfast and checkout. Visit Meenakshi Amman Temple, Arulmigu Koodal Azhagar Temple, Gandhi Memorial Museum and Thirumalai Nayakkar Palace. Proceed to Madurai Airport for onward journey."),
    ],
    # ------------------------------------------------------- Himalayan expeditions
    "markha-valley": [
        day(1, "Leh", "Arrive Leh."),
        day(2, "Leh", "Leh."),
        day(3, "Leh / Spituk", "Leh, Spituk and trek to Zingchen."),
        day(4, "Zinchen – Yurutse", "Zinchen to Yurutse."),
        day(5, "Yurutse – Gondola – Skiu", "Yurutse to Gondola to Skiu."),
        day(6, "Skiu – Markha", "Skiu to Markha."),
        day(7, "Markha – Tchatchungtse", "Markha to Tchatchungtse."),
        day(8, "Tchatchungtse – Nimaling", "Tchatchungtse to Nimaling."),
        day(9, "Nimaling – Knogmarula – Shang Sumdo", "Nimaling to Knogmarula to Shang Sumdo."),
        day(10, "Shang Sumdo – Hemis – Leh", "Shang Sumdo to Hemis to Leh."),
    ],
    "kashmir-zanskar-ladakh-trek": [
        day(1, "Delhi", "Arrival in Delhi."),
        day(2, "Srinagar", "Fly to Srinagar."),
        day(3, "Srinagar", "Srinagar."),
        day("04–18", "Trek", "Trekking commences until Day 18."),
        day("19–20", "Leh", "Leh sightseeing."),
        day(21, "Delhi", "Fly to Delhi."),
        day(22, "Delhi", "Delhi."),
        day(23, "Agra", "Optional trip to Agra."),
        day(24, "Delhi", "Further travels."),
    ],
    "kashmir-combinations-little-tibet": [
        day(1, "Delhi", "Arrival in Delhi."),
        day(2, "Srinagar", "Fly to Srinagar."),
        day(3, "Srinagar", "Srinagar sightseeing."),
        day(4, "Srinagar", "Srinagar sightseeing."),
        day("05–11", "Trek", "Trekking commences until day 11."),
        day(12, "Kargil", "Drive to Kargil."),
        day(13, "Leh", "Drive to Leh."),
        day(14, "Leh", "Leh sightseeing."),
        day(15, "Leh", "Leh."),
        day(16, "Delhi", "Leh to Delhi."),
        day(17, "Delhi", "Delhi."),
        day(18, "Agra", "Delhi Agra."),
    ],
    # ------------------------------------------------------- Mini trek in Kashmir
    "kashmir-mini-adventure": [
        day(1, "Sonamarg", "Drive to Sonamarg (80 kms), enroute visiting Ganderbal and Kangan."),
        day(2, "Nichnai", "Trek from Thajiwas to Nichanai (13 kms). The walk involves a steady ascent of 5250 ft. Overnight camp at Nichnai."),
        day(3, "Nichnai / Vishansar Lake", "Nichnai Vishansar Lake (13 kms). A climb of 2000 ft. over the pass at 13400 ft, overnight camping besides the lake."),
        day(4, "Gadsar", "Vishansar to Gadsar (10 kms)."),
        day(5, "Gangabal Lake", "Gadsar to Gangabal Lake. Trek climbing passes to 10,000 ft, overnight camping besides the lake."),
        day(6, "Gangabal Lake", "Rest day, optional fishing in Gangabal Lake."),
        day(7, "Naranag / Srinagar", "Descent trek to Naranag Ruin temple. Drive to Srinagar."),
    ],
    "kashmir-ski": [
        day(1, "Srinagar – Gulmarg", "Transfer by car to Gulmarg."),
        day("02–06", "Gulmarg", "Enjoy skiing at your leisure."),
        day(7, "Gulmarg – Srinagar", "Return to Srinagar by car."),
    ],
    "vale-of-kashmir-trek": [
        day(1, "Srinagar – Aru", "Drive from Srinagar to Aru via Pahalgam. Overnight at Aru."),
        day(2, "Lidderwat", "Aru to Lidderwat."),
        day(3, "Kolohoi Glacier", "Full day trek to Kolohoi Glacier with overnight at Lidderwat."),
        day(4, "Sekiwas", "Lidderwat to Sekiwas."),
        day(5, "Sekiwas", "Sekiwas."),
        day(6, "Sanmous", "Sekiwas to Sanmous."),
        day(7, "Sindh Valley", "Sanmous to Sindh Valley Road. Drive to Srinagar."),
    ],
    # ---------------------------------------------------------- Nepal adventure
    "himalayan-combination-nepal": [
        day(1, "Kathmandu", "Arrival in Kathmandu."),
        day(2, "Kathmandu", "Sightseeing in Kathmandu."),
        day(3, "Pokhara / Trek", "Drive to Pokhara, where the trek commences and continues until day 11."),
        day(11, "Trisuli", "Drive to Trisuli River Camp. Rafting until day 14."),
        day(14, "Chitwan", "Drive to Royal Chitwan National Park on safari until day 17."),
        day(17, "Kathmandu", "Drive to Kathmandu where you are at leisure until day 20."),
        day(20, "Kathmandu", "Fly to destination."),
    ],
    "nepal-mini-trek-4-day": [
        day(1, "Kathmandu / Bhaktapur", "Drive from Kathmandu to Bhaktapur, commence trek. Overnight Nagarkot."),
        day(2, "Chowki Bhanjyang", "Nagarkot to Chowki Bhanjyang."),
        day(3, "Chowki Bhanjyang", "Nagarkot to Chowki Bhanjyang."),
        day(4, "Chisapani / Sundarijal", "Trek from Chisapani to Sundarijal. Return to Kathmandu. Detailed itineraries available on request. Night stops may vary due to local weather conditions."),
    ],
    "nepal-wildlife-safari": [
        day(1, "Kathmandu / Chitwan National Park", "Travel to Chitwan by road. Afternoon safari."),
        day(2, "Chitwan National Park", "Safaris at the Park."),
        day(3, "Chitwan National Park", "Safaris at the Park."),
        day(4, "Chitwan National Park / Kathmandu", "Morning safari. Return to Kathmandu by road."),
    ],
    "trisuli-rafting": [
        day(1, "Trisuli River", "Day trip, depart Kathmandu to Phishling. After a brief safety talk and basic demonstration, we set off for an exciting day of whitewater rafting. During the day there will be four major rapids and several smaller ones. We stop for lunch on a sunny beach then continue on to Simaltar after rafting for 24 kms. Return to Kathmandu."),
    ],
    "nepal-mini-trek-7-day": [
        day(1, "Kathmandu / Bhaktapur", "Drive from Kathmandu to Bhaktapur. Commence trek. Overnight at Nagarkot."),
        day(2, "Sinjaruwa", "Nagarkot to Sinjaruwa."),
        day(3, "Chisapani", "Sinjaruwa to Chisapani."),
        day(4, "Borlang Bhanjyang", "Chisapani to Borlang Bhanjyang."),
        day(5, "Borlang Bhanjyang", "Borlang Bhanjyang."),
        day(6, "Sivapuri", "Borlang Bhanjyang to Sivapuri."),
        day(7, "Budhanikantha", "Trek from Sivapure to Budhanikantha. Return to Kathmandu."),
    ],
}


# Package-scoped inclusion / exclusion lists, transcribed only where the brochure
# prints them against that package. The brochure's generic panel is never applied
# to a package whose content_flags forbid it.
INCLUSIONS = {
    "glorious-goa-stopover": [
        "Transfers and sightseeing as specified by car.",
        "Accommodation on a room-only basis.",
    ],
    "glimpses-of-kerala": [
        "All transfers and sightseeing as specified by car.",
        "Wildlife viewing at Periyar Sanctuary by motor boat.",
        "Backwater cruise between Kottayam and Alleppey.",
    ],
    "markha-valley": [
        "All camping equipment, sleeping bags, two-man tents and insulated ground mats.",
        "Pack ponies or porters.",
        "Experienced English-speaking guides.",
        "Support crews.",
        "Sightseeing tours as specified.",
        "All transfers and transportation as specified in the itinerary.",
        "Three meals daily during the trek.",
        "Hotel accommodation on a twin-sharing basis.",
        "Full board in Leh and on houseboats if trekking in Kashmir.",
    ],
    "kashmir-ski": [
        "Return car transfers from Srinagar.",
        "Ski equipment (excluding ski clothing).",
        "Ski lift pass.",
        "Standard accommodation with private facilities.",
        "All meals in Gulmarg.",
    ],
    "nepal-wildlife-safari": [
        "All meals included at Chitwan Jungle Lodge.",
        "Round trip transportation to Kathmandu.",
        "All safaris in the park with guides.",
    ],
    "trisuli-rafting": [
        "Return transport to Trisuli River.",
        "Rafting equipment and experienced English-speaking guide.",
        "Packed lunch.",
    ],
    "north-india-highlights": [
        "First-class train travel.",
        "Hotel accommodation with breakfast.",
        "Transfers and sightseeing as per the itinerary.",
        "All meals in Srinagar.",
    ],
}

EXCLUSIONS = {
    "north-india-highlights": [
        "International flights.",
        "Domestic flights for the Jaipur–Udaipur–Delhi–Srinagar–Leh–Delhi sector.",
    ],
    "kashmir-zanskar-ladakh-trek": [
        "International and domestic flights.",
        "Meals outside the package.",
        "Monument entrance tickets.",
        "Guides and optional activities not mentioned in the itinerary.",
        "Horse rides and gondola tickets.",
        "Travel insurance.",
        "Personal expenses such as laundry, phone calls, beverages, etc.",
        "Tips for guides, drivers and support staff.",
        "Gulf fishing and other non-itinerary activities.",
    ],
}


# New flags raised while transcribing, keyed by package id.
NEW_FLAGS = {
    "delhi-to-kathmandu": [
        "The brochure scan for this package is only partly legible: Day 3 shows 'Afternoon Activity' with no further detail, and Day 6 is reconstructed from a fragment. Confirm the full programme with the operator.",
    ],
    "india-nepal-combination": [
        "The brochure scan for Day 11 (Agra / Varanasi) shows only the route, with no description. Confirm the Day 11 transfer and evening programme.",
    ],
    "kashmir-combinations-little-tibet": [
        "The brochure describes this as a 19-day round trip but lists 18 stages. Confirm the missing day.",
    ],
    "nepal-mini-trek-4-day": [
        "The brochure scan repeats the same 'Nagarkot to Chowki Bhanjyang' line for Day 2 and Day 3. One of the two is likely a different stage; confirm the sequence.",
    ],
    "himalayan-combination-nepal": [
        "The brochure lists only the anchor days (1, 2, 3, 11, 14, 17 and 20) for this 20-day programme; the days in between are described in the overview text rather than day by day.",
    ],
    "kashmir-zanskar-ladakh-trek": [
        "The brochure describes this as a 24-day round trip with a 15-day trek, while the day list shows trekking from Day 4 to Day 18. Confirm the trek length and day numbering.",
    ],
    "kashmir-package-7-day": [
        "The brochure prints six days for this package while the card states 7 days / 6 nights. Confirm the missing day.",
    ],
}


SERVICE_FEATURES = [
    "Houseboats vary in size from two to seven bedrooms, each with private ensuite facilities.",
    "A veranda at the front with lake view, and a sundeck on the roof.",
    "A houseboat boy is in attendance at all times.",
    "An extensive menu with a choice of Western, Indian or Kashmiri cuisine.",
    "Pleasant dining and living rooms with intricately carved walnut furniture and Kashmir carpets.",
    "Wood carving, carpet making and papier-mache making.",
    "Trips to the mountain resorts of Gulmarg and Pahalgam.",
    "Bookings can be made for groups and individuals, and sole use of a houseboat can be hired.",
    "Deluxe and \"A\" class houseboats on Nagin or Dal Lake; classification of houseboats is the responsibility of the Kashmir Government.",
    "Immediate confirmation can be given from all-season allocations.",
]


def main():
    with open(APP_CATALOGUE, encoding="utf-8") as fh:
        catalogue = json.load(fh)

    packages = {p["id"]: p for p in catalogue["packages"]}

    missing = [pid for pid in PROGRAMMES if pid not in packages]
    if missing:
        raise SystemExit(f"Unknown package ids in transcription: {missing}")

    for pid, programme in PROGRAMMES.items():
        package = packages[pid]
        package["itinerary"] = programme

    for pid, items in INCLUSIONS.items():
        packages[pid]["inclusions"] = items

    for pid, items in EXCLUSIONS.items():
        packages[pid]["exclusions"] = items

    for pid, flags in NEW_FLAGS.items():
        existing = packages[pid].setdefault("content_flags", [])
        for flag in flags:
            if flag not in existing:
                existing.append(flag)

    service = catalogue["additional_services"][0]
    for feature in SERVICE_FEATURES:
        if feature not in service["features"]:
            service["features"].append(feature)

    with open(APP_CATALOGUE, "w", encoding="utf-8", newline="\n") as fh:
        json.dump(catalogue, fh, indent=2, ensure_ascii=False)
        fh.write("\n")

    shutil.copyfile(APP_CATALOGUE, ROOT_CATALOGUE)

    print(f"Updated {APP_CATALOGUE}")
    print(f"Mirrored to {ROOT_CATALOGUE}")
    print(f"Programmes transcribed: {len(PROGRAMMES)}")
    print(f"Packages with inclusions: {len(INCLUSIONS)}")
    print(f"Packages with exclusions: {len(EXCLUSIONS)}")
    print(f"New content flags added: {len(NEW_FLAGS)}")


if __name__ == "__main__":
    main()
