import re
p="app/src/data/siteContent.ts"
s=open(p,encoding="utf-8").read()

# Pillar: destinations
s=s.replace(
'''    body:
      "By being among the first in a place, we have access to some of Earth's most significant wild places. Each destination opens a whole new world of landscapes, cultures, sights and sounds for you to discover.",''',
'''    body:
      "A specialist operator for India and Nepal since 1927. Each destination opens a whole new world of landscapes, cultures, sights and sounds for you to discover, from the Himalaya to the backwaters.",''')

# Pillar: wildlife
s=s.replace(
'''    body:
      "Meet guides with an uncommon ability for understanding, finding and explaining wildlife. Chitwan's rhino and elephant herds, Periyar's elephants and the birdlife of the Terai are all reached on foot, by boat and by vehicle.",''',
'''    body:
      "Wildlife journeys reach Chitwan, Periyar and the Terai, with resident naturalists, elephant and jeep safaris, nature walks and canoe trips among the programme options.",''')

# Pillar: guides
s=s.replace(
'''    body:
      "Our guides are hired locally and stay with an itinerary from its first day to its last, so you are always walking with someone who knows the trail, the weather and the village.",''',
'''    body:
      "Experienced English-speaking guides and support crews accompany trekking and safari itineraries, with a team leader from Australia for special-interest programmes.",''')

# Pillar: architecture/hotels
s=s.replace(
'''    body:
      "All our accommodation is carefully selected. Hotels are well serviced and centrally located, with properties chosen for their ambience and creation of comfort, their architecture and their history.",''',
'''    body:
      "All accommodation is carefully selected: well serviced and centrally located, chosen for ambience, comfort, architecture and history, from deluxe categories to family-run establishments.",''')

# Pillar: culture (keep but ensure group claim supported)
s=s.replace(
'''    body:
      "From dawn on the ghats of Varanasi to Buddhist monasteries in Ladakh, each place honours its own traditions. Special-interest programmes can be arranged for your club, school, social or special-interest group.",''',
'''    body:
      "From dawn on the ghats of Varanasi to Buddhist monasteries in Ladakh, each place honours its own traditions. Special-interest programmes can be arranged for clubs, schools and groups on request.",''')

# Pillar: travel (remove flights/permits claim)
s=s.replace(
'''    body:
      "Flights, road transfers, permits and accommodation are planned around your dates and party, with a local contact on the ground for every leg of the journey.",''',
'''    body:
      "Road transfers, accommodation and sightseeing are planned around your dates and party, with arrival and departure transfers included in the package inclusions.",''')

# Pillar: impact (remove unsupported impact)
s=s.replace(
'''    body:
      "We hire locally and run escorted student tours and community programmes across India and Nepal, keeping the value of your journey inside the places you visit.",''',
'''    body:
      "Escorted student tours run for schools in both India and Nepal, and special-interest programmes can be arranged for clubs, schools and groups.",''')

# Experiences: rafting remove grade claim
s=s.replace(
'''    description:
      "Grade II and III rapids on the Trisuli, with an English-speaking river guide and full safety equipment.",''',
'''    description:
      "Whitewater rafting on the Trisuli with rafting equipment and an experienced English-speaking guide.",''')

# Experiences: temples remove "with a guide at each stop"
s=s.replace(
'''    description:
      "The Taj Mahal, Amber Fort, Swayambhunath and the ghats of Varanasi, with a guide at each stop.",''',
'''    description:
      "The Taj Mahal, Amber Fort, Swayambhunath and the ghats of Varanasi, as listed in the brochure itineraries.",''')

# Experiences: village culture
s=s.replace(
'''    description:
      "Special-interest programmes with schools and community groups, arranged around the interests you name.",''',
'''    description:
      "Special-interest programmes for clubs, schools and groups, arranged on request.",''')

# Stats: tailor-made wording
s=s.replace(
'''  { value: "Tailor-made", label: "Every itinerary", note: "Shaped around your dates" },''',
'''  { value: "Flexible", label: "Every itinerary", note: "Planned around your dates" },''')

open(p,"w",encoding="utf-8").write(s)
print("done")
