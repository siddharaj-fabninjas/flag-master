const FLAG_HINTS = {
            // Major Countries - Tier 1
            'USA': {
                mnemonic: "🗽 Stars for states, stripes for original 13 colonies. Red, white & blue = freedom!",
                colors: [
                    { color: '#B22234', name: 'Red', meaning: 'Valor & bravery' },
                    { color: '#FFFFFF', name: 'White', meaning: 'Purity & innocence' },
                    { color: '#3C3B6E', name: 'Blue', meaning: 'Vigilance & justice' }
                ],
                similar: ['LBR', 'MYS'] // Liberia, Malaysia have similar patterns
            },
            'GBR': {
                mnemonic: "🇬🇧 Union Jack = Union of England (red cross), Scotland (blue X), Ireland (red X)",
                colors: [
                    { color: '#012169', name: 'Blue', meaning: 'Scotland' },
                    { color: '#C8102E', name: 'Red', meaning: 'England & Ireland' },
                    { color: '#FFFFFF', name: 'White', meaning: 'Peace between nations' }
                ],
                similar: ['AUS', 'NZL', 'FJI'] // Countries with Union Jack
            },
            'FRA': {
                mnemonic: "🥖 Blue-White-Red like the French Revolution motto: Liberty, Equality, Fraternity",
                colors: [
                    { color: '#002395', name: 'Blue', meaning: 'Liberty' },
                    { color: '#FFFFFF', name: 'White', meaning: 'Equality' },
                    { color: '#ED2939', name: 'Red', meaning: 'Fraternity' }
                ],
                similar: ['NLD', 'RUS'] // Similar tricolors
            },
            'DEU': {
                mnemonic: "🍺 Black-Red-Gold: Think of a German beer in a dark bar with golden light!",
                colors: [
                    { color: '#000000', name: 'Black', meaning: 'Determination' },
                    { color: '#DD0000', name: 'Red', meaning: 'Bravery' },
                    { color: '#FFCC00', name: 'Gold', meaning: 'Generosity' }
                ],
                similar: ['BEL'] // Belgium is vertical
            },
            'ITA': {
                mnemonic: "🍕 Pizza colors! Green basil, white mozzarella, red tomato sauce",
                colors: [
                    { color: '#009246', name: 'Green', meaning: 'Hope & plains' },
                    { color: '#FFFFFF', name: 'White', meaning: 'Faith & snowy Alps' },
                    { color: '#CE2B37', name: 'Red', meaning: 'Charity & blood of wars' }
                ],
                similar: ['IRL', 'CIV', 'MEX'] // Green-white-red variants
            },
            'ESP': {
                mnemonic: "🏰 Red-Yellow-Red with coat of arms. Think of Spanish sunset over a castle!",
                colors: [
                    { color: '#AA151B', name: 'Red', meaning: 'Blood of fallen soldiers' },
                    { color: '#F1BF00', name: 'Yellow', meaning: 'Generosity & Spanish sun' }
                ],
                similar: []
            },
            'JPN': {
                mnemonic: "🌅 The red circle is the Rising Sun - Japan is the 'Land of the Rising Sun'",
                colors: [
                    { color: '#FFFFFF', name: 'White', meaning: 'Honesty & purity' },
                    { color: '#BC002D', name: 'Red', meaning: 'The sun goddess Amaterasu' }
                ],
                similar: ['BGD', 'PLW'] // Bangladesh, Palau have circles
            },
            'CHN': {
                mnemonic: "⭐ Red background = communism. Big star = Communist Party, 4 small stars = people",
                colors: [
                    { color: '#DE2910', name: 'Red', meaning: 'Communist revolution' },
                    { color: '#FFDE00', name: 'Yellow', meaning: 'Golden future' }
                ],
                similar: ['VNM'] // Vietnam also red with yellow star
            },
            'IND': {
                mnemonic: "🕉️ Saffron-White-Green with Ashoka Chakra (wheel). The wheel has 24 spokes = 24 hours",
                colors: [
                    { color: '#FF9933', name: 'Saffron', meaning: 'Courage & sacrifice' },
                    { color: '#FFFFFF', name: 'White', meaning: 'Peace & truth' },
                    { color: '#138808', name: 'Green', meaning: 'Faith & fertility' },
                    { color: '#000080', name: 'Navy', meaning: 'Dharma wheel' }
                ],
                similar: ['NER', 'CIV'] // Niger has similar colors
            },
            'BRA': {
                mnemonic: "⚽ Green jungle, yellow diamond (gold!), blue sky with stars for each state",
                colors: [
                    { color: '#009C3B', name: 'Green', meaning: 'Forests of Brazil' },
                    { color: '#FFDF00', name: 'Yellow', meaning: 'Gold & wealth' },
                    { color: '#002776', name: 'Blue', meaning: 'Sky over Rio' }
                ],
                similar: []
            },
            'CAN': {
                mnemonic: "🍁 Red-White-Red with the iconic maple leaf. Canada = Maple syrup!",
                colors: [
                    { color: '#FF0000', name: 'Red', meaning: 'England' },
                    { color: '#FFFFFF', name: 'White', meaning: 'France & peace' }
                ],
                similar: []
            },
            'AUS': {
                mnemonic: "🦘 Union Jack (British history) + Southern Cross constellation (only visible in Southern Hemisphere)",
                colors: [
                    { color: '#012169', name: 'Blue', meaning: 'Ocean surrounding Australia' },
                    { color: '#FFFFFF', name: 'White', meaning: 'Southern Cross stars' },
                    { color: '#C8102E', name: 'Red', meaning: 'British heritage' }
                ],
                similar: ['NZL', 'GBR'] // Similar Union Jack flags
            },
            'MEX': {
                mnemonic: "🌮 Green-White-Red (like Italy) but with eagle eating a snake on a cactus in the center!",
                colors: [
                    { color: '#006847', name: 'Green', meaning: 'Hope & independence' },
                    { color: '#FFFFFF', name: 'White', meaning: 'Purity & Catholicism' },
                    { color: '#CE1126', name: 'Red', meaning: 'Blood of heroes' }
                ],
                similar: ['ITA', 'IRL'] // Same colors, different symbol
            },
            'RUS': {
                mnemonic: "🪆 White-Blue-Red from top. Think of snow (white), sky (blue), and Russian passion (red)",
                colors: [
                    { color: '#FFFFFF', name: 'White', meaning: 'Nobility & peace' },
                    { color: '#0039A6', name: 'Blue', meaning: 'Faithfulness & loyalty' },
                    { color: '#D52B1E', name: 'Red', meaning: 'Courage & love' }
                ],
                similar: ['NLD', 'FRA', 'SRB'] // Similar tricolors
            },
            'KOR': {
                mnemonic: "☯️ Yin-Yang in center + 4 trigrams from I-Ching. White = peace, trigrams = elements",
                colors: [
                    { color: '#FFFFFF', name: 'White', meaning: 'Peace & purity' },
                    { color: '#CD2E3A', name: 'Red', meaning: 'Positive cosmic forces' },
                    { color: '#0047A0', name: 'Blue', meaning: 'Negative cosmic forces' },
                    { color: '#000000', name: 'Black', meaning: 'Trigrams of balance' }
                ],
                similar: []
            },
            'NLD': {
                mnemonic: "🌷 Red-White-Blue horizontal stripes. Netherlands = tulips & windmills. Similar to Russia but brighter red!",
                colors: [
                    { color: '#AE1C28', name: 'Red', meaning: 'Bravery' },
                    { color: '#FFFFFF', name: 'White', meaning: 'Peace' },
                    { color: '#21468B', name: 'Blue', meaning: 'Loyalty' }
                ],
                similar: ['RUS', 'LUX', 'FRA'] // Similar horizontal stripes
            },
            'CHE': {
                mnemonic: "➕ Red square with white cross. Switzerland = Swiss Army knives + Red Cross was founded here!",
                colors: [
                    { color: '#FF0000', name: 'Red', meaning: 'Bravery & strength' },
                    { color: '#FFFFFF', name: 'White', meaning: 'Peace & neutrality' }
                ],
                similar: ['DNK', 'GEO'] // Cross flags
            },
            'SWE': {
                mnemonic: "🔵 Blue with yellow Nordic cross. Think IKEA colors! Blue is offset to the left.",
                colors: [
                    { color: '#006AA7', name: 'Blue', meaning: 'Swedish sky' },
                    { color: '#FECC00', name: 'Yellow', meaning: 'Swedish sun & gold' }
                ],
                similar: ['FIN', 'DNK', 'NOR'] // Nordic cross flags
            },
            'NOR': {
                mnemonic: "🎿 Red with blue-bordered white cross. Think of skiing in red suits on white snow under blue sky!",
                colors: [
                    { color: '#BA0C2F', name: 'Red', meaning: 'Freedom' },
                    { color: '#FFFFFF', name: 'White', meaning: 'Snow & peace' },
                    { color: '#00205B', name: 'Blue', meaning: 'Freedom' }
                ],
                similar: ['ISL', 'DNK', 'SWE'] // Nordic cross flags
            },
            'DNK': {
                mnemonic: "🧜‍♀️ Red with white Nordic cross - the oldest national flag still in use! White cross offset left.",
                colors: [
                    { color: '#C8102E', name: 'Red', meaning: 'Bravery' },
                    { color: '#FFFFFF', name: 'White', meaning: 'Peace' }
                ],
                similar: ['CHE', 'NOR', 'SWE'] // Cross flags
            },
            'GRC': {
                mnemonic: "🏛️ Blue-white stripes (9 stripes = 9 syllables of 'Freedom or Death') + cross in corner",
                colors: [
                    { color: '#0D5EAF', name: 'Blue', meaning: 'Sea & sky' },
                    { color: '#FFFFFF', name: 'White', meaning: 'Purity of independence' }
                ],
                similar: ['URY'] // Uruguay has similar stripes
            },
            'TUR': {
                mnemonic: "🌙 Red with white crescent moon & star. Crescent = Islam, same as many Muslim countries",
                colors: [
                    { color: '#E30A17', name: 'Red', meaning: 'Blood of martyrs' },
                    { color: '#FFFFFF', name: 'White', meaning: 'Peace' }
                ],
                similar: ['TUN', 'PAK', 'DZA'] // Crescent flags
            },
            'EGY': {
                mnemonic: "🦅 Red-White-Black horizontal + Golden Eagle of Saladin in center. Ancient pharaoh vibes!",
                colors: [
                    { color: '#CE1126', name: 'Red', meaning: 'Revolution & sacrifice' },
                    { color: '#FFFFFF', name: 'White', meaning: 'Bright future' },
                    { color: '#000000', name: 'Black', meaning: 'Dark past of oppression' }
                ],
                similar: ['IRQ', 'SYR', 'YEM'] // Arab Liberation colors
            },
            'ZAF': {
                mnemonic: "🌈 The Y-shape represents diverse paths converging as one nation. Most colorful flag!",
                colors: [
                    { color: '#007A4D', name: 'Green', meaning: 'Fertility & natural beauty' },
                    { color: '#FFB612', name: 'Gold', meaning: 'Natural resources' },
                    { color: '#DE3831', name: 'Red', meaning: 'Bloodshed in history' },
                    { color: '#002395', name: 'Blue', meaning: 'Sky & opportunities' },
                    { color: '#000000', name: 'Black', meaning: 'Black South Africans' },
                    { color: '#FFFFFF', name: 'White', meaning: 'White South Africans' }
                ],
                similar: []
            },
            'ARG': {
                mnemonic: "☀️ Light blue-white-blue with Sun of May in center. Sky blue like Argentine sky!",
                colors: [
                    { color: '#74ACDF', name: 'Sky Blue', meaning: 'Sky & heaven' },
                    { color: '#FFFFFF', name: 'White', meaning: 'Peace & honesty' },
                    { color: '#F6B40E', name: 'Gold', meaning: 'Sun of May' }
                ],
                similar: ['URY', 'SLV'] // Similar blue-white pattern
            },
            'PRT': {
                mnemonic: "🚢 Green-Red vertical with coat of arms. Green on left (not common!), coat of arms has explorer ships",
                colors: [
                    { color: '#006600', name: 'Green', meaning: 'Hope for the future' },
                    { color: '#FF0000', name: 'Red', meaning: 'Blood of those who died' }
                ],
                similar: []
            },
            'IRL': {
                mnemonic: "☘️ Green (Catholics) - White (peace) - Orange (Protestants). Green on the flagpole side!",
                colors: [
                    { color: '#169B62', name: 'Green', meaning: 'Gaelic Irish Catholics' },
                    { color: '#FFFFFF', name: 'White', meaning: 'Peace between both' },
                    { color: '#FF883E', name: 'Orange', meaning: 'Protestant Irish' }
                ],
                similar: ['CIV'] // Ivory Coast is reversed!
            },
            'CIV': {
                mnemonic: "🍊 Orange-White-Green (opposite of Ireland!). Think: Ivory Coast has Orange first like an orange fruit",
                colors: [
                    { color: '#F77F00', name: 'Orange', meaning: 'Land & savanna' },
                    { color: '#FFFFFF', name: 'White', meaning: 'Peace' },
                    { color: '#009E60', name: 'Green', meaning: 'Forests & hope' }
                ],
                similar: ['IRL'] // Ireland is reversed!
            },
            'POL': {
                mnemonic: "🦅 Simple White over Red horizontal. White eagle on top (national symbol), red below!",
                colors: [
                    { color: '#FFFFFF', name: 'White', meaning: 'White eagle of Poland' },
                    { color: '#DC143C', name: 'Red', meaning: 'Blood & sunset sky' }
                ],
                similar: ['IDN', 'MCO'] // Monaco & Indonesia are red-white
            },
            'AUT': {
                mnemonic: "🎼 Red-White-Red horizontal. Think of Austrian Schnitzel (red paprika, white veal, red ketchup)",
                colors: [
                    { color: '#ED2939', name: 'Red', meaning: 'Strength & bravery' },
                    { color: '#FFFFFF', name: 'White', meaning: 'Peace' }
                ],
                similar: ['LVA', 'PER'] // Similar horizontal stripes
            },
            'BEL': {
                mnemonic: "🍫 Black-Yellow-Red VERTICAL. Belgian chocolate (black), golden beer (yellow), strawberry (red)",
                colors: [
                    { color: '#000000', name: 'Black', meaning: 'Shield of arms' },
                    { color: '#FFD90F', name: 'Yellow', meaning: 'Lion of arms' },
                    { color: '#F31830', name: 'Red', meaning: 'Claws & tongue of lion' }
                ],
                similar: ['DEU'] // Germany is horizontal with same colors
            },
            'UKR': {
                mnemonic: "🌾 Blue sky over golden wheat fields. Simple but meaningful - Ukrainian agriculture!",
                colors: [
                    { color: '#0057B7', name: 'Blue', meaning: 'Clear blue sky' },
                    { color: '#FFD700', name: 'Yellow', meaning: 'Fields of wheat' }
                ],
                similar: []
            },
            'NZL': {
                mnemonic: "🥝 Blue with Union Jack + 4 red stars (Southern Cross). Similar to Australia but FOUR stars, red with white border",
                colors: [
                    { color: '#012169', name: 'Blue', meaning: 'Pacific Ocean' },
                    { color: '#C8102E', name: 'Red', meaning: 'Southern Cross stars' },
                    { color: '#FFFFFF', name: 'White', meaning: 'Long white cloud' }
                ],
                similar: ['AUS'] // Both have Union Jack
            },
            'SGP': {
                mnemonic: "🦁 Red-White horizontal with crescent & 5 stars. Crescent = young nation, 5 stars = ideals",
                colors: [
                    { color: '#EF3340', name: 'Red', meaning: 'Brotherhood & equality' },
                    { color: '#FFFFFF', name: 'White', meaning: 'Purity & virtue' }
                ],
                similar: ['IDN', 'POL'] // Red-white combinations
            },
            'ISR': {
                mnemonic: "✡️ Blue Star of David between two blue stripes on white. Like a Jewish prayer shawl (tallit)!",
                colors: [
                    { color: '#0038B8', name: 'Blue', meaning: 'Sky & divinity' },
                    { color: '#FFFFFF', name: 'White', meaning: 'Purity' }
                ],
                similar: []
            },
            'SAU': {
                mnemonic: "⚔️ Green with white Arabic text (Shahada) & sword. Green = Islam, sword = House of Saud",
                colors: [
                    { color: '#006C35', name: 'Green', meaning: 'Islam' },
                    { color: '#FFFFFF', name: 'White', meaning: 'Purity of faith' }
                ],
                similar: []
            },
            'ARE': {
                mnemonic: "🏙️ UAE = Red-Green-White-Black. Red vertical bar on left + horizontal stripes. Dubai skyscrapers!",
                colors: [
                    { color: '#00732F', name: 'Green', meaning: 'Fertility' },
                    { color: '#FFFFFF', name: 'White', meaning: 'Neutrality' },
                    { color: '#000000', name: 'Black', meaning: 'Oil wealth' },
                    { color: '#FF0000', name: 'Red', meaning: 'Unity' }
                ],
                similar: ['JOR', 'PSE', 'KWT'] // Pan-Arab colors
            },
            'THA': {
                mnemonic: "🐘 Red-White-Blue-White-Red stripes. Blue is wider (doubled). Think Thai elephants are blue (royal color)!",
                colors: [
                    { color: '#A51931', name: 'Red', meaning: 'Nation & blood' },
                    { color: '#FFFFFF', name: 'White', meaning: 'Religion (Buddhism)' },
                    { color: '#2D2A4A', name: 'Blue', meaning: 'Monarchy' }
                ],
                similar: ['CRI', 'NLD'] // Stripe patterns
            },
            'VNM': {
                mnemonic: "⭐ Red with large yellow star. Communist flag - star represents workers, peasants, soldiers, intellectuals, youth",
                colors: [
                    { color: '#DA251D', name: 'Red', meaning: 'Blood & revolution' },
                    { color: '#FFFF00', name: 'Yellow', meaning: 'Vietnamese people' }
                ],
                similar: ['CHN'] // Both communist red with yellow
            },
            'IDN': {
                mnemonic: "🏝️ Red over White (like Poland upside down!). Same as Monaco but wider aspect ratio!",
                colors: [
                    { color: '#CE1126', name: 'Red', meaning: 'Courage' },
                    { color: '#FFFFFF', name: 'White', meaning: 'Purity' }
                ],
                similar: ['MCO', 'POL'] // Monaco (same!) and Poland (inverted)
            },
            'MCO': {
                mnemonic: "🎰 Red over White - SAME as Indonesia but Monaco is shorter (smaller country, smaller flag!)",
                colors: [
                    { color: '#CE1126', name: 'Red', meaning: 'Grimaldi family' },
                    { color: '#FFFFFF', name: 'White', meaning: 'Peace' }
                ],
                similar: ['IDN', 'POL'] // Indonesia (same!) and Poland (inverted)
            },
            'PAK': {
                mnemonic: "☪️ Green with white stripe on left + crescent & star. White represents minorities, green represents Islam",
                colors: [
                    { color: '#01411C', name: 'Green', meaning: 'Muslim majority' },
                    { color: '#FFFFFF', name: 'White', meaning: 'Religious minorities' }
                ],
                similar: ['TUR', 'TUN'] // Crescent flags
            },
            'NGA': {
                mnemonic: "🌴 Green-White-Green vertical. Green for agriculture, white for peace. Simple and symmetric!",
                colors: [
                    { color: '#008751', name: 'Green', meaning: 'Agriculture & forests' },
                    { color: '#FFFFFF', name: 'White', meaning: 'Peace & unity' }
                ],
                similar: []
            },
            'JAM': {
                mnemonic: "🎸 Gold X on green & black. Think of Jamaica = reggae, Rasta colors! X marks the treasure island!",
                colors: [
                    { color: '#009B3A', name: 'Green', meaning: 'Hope & agriculture' },
                    { color: '#FED100', name: 'Gold', meaning: 'Sunshine & resources' },
                    { color: '#000000', name: 'Black', meaning: 'Hardships overcome' }
                ],
                similar: []
            },
            'CUB': {
                mnemonic: "🚗 Blue-white stripes + red triangle with white star. Red triangle points to progress!",
                colors: [
                    { color: '#002A8F', name: 'Blue', meaning: 'Three old divisions' },
                    { color: '#FFFFFF', name: 'White', meaning: 'Purity of ideals' },
                    { color: '#CB1515', name: 'Red', meaning: 'Blood of patriots' }
                ],
                similar: ['PRI'] // Puerto Rico has inverted colors
            },
            'NPL': {
                mnemonic: "🏔️ The ONLY non-rectangular flag! Two triangles = Himalayan mountains. Hindu & Buddhist symbols.",
                colors: [
                    { color: '#DC143C', name: 'Crimson', meaning: 'National color & bravery' },
                    { color: '#003893', name: 'Blue', meaning: 'Peace & harmony' }
                ],
                similar: []
            },
            'FIN': {
                mnemonic: "❄️ White with blue Nordic cross. White = snow (Finland is VERY snowy!), blue = lakes",
                colors: [
                    { color: '#FFFFFF', name: 'White', meaning: 'Snow of Finland' },
                    { color: '#003580', name: 'Blue', meaning: 'Thousands of lakes' }
                ],
                similar: ['SWE', 'DNK', 'NOR'] // Nordic cross flags
            },
            'ROU': {
                mnemonic: "🏰 Blue-Yellow-Red vertical. Almost identical to Chad! Romania = LIGHTER blue (European sky)",
                colors: [
                    { color: '#002B7F', name: 'Blue', meaning: 'Liberty' },
                    { color: '#FCD116', name: 'Yellow', meaning: 'Justice' },
                    { color: '#CE1126', name: 'Red', meaning: 'Fraternity' }
                ],
                similar: ['TCD', 'MDA'] // Chad is darker blue!
            },
            'TCD': {
                mnemonic: "🏜️ Blue-Yellow-Red vertical. Almost identical to Romania! Chad = DARKER blue (African night sky)",
                colors: [
                    { color: '#002664', name: 'Blue', meaning: 'Sky & hope' },
                    { color: '#FECB00', name: 'Yellow', meaning: 'Sun & desert' },
                    { color: '#C60C30', name: 'Red', meaning: 'Blood of martyrs' }
                ],
                similar: ['ROU', 'MDA'] // Romania is lighter blue!
            },
            'ISL': {
                mnemonic: "🌋 Blue with red-bordered white Nordic cross. Blue = ocean, white = ice, red = volcanic fire!",
                colors: [
                    { color: '#02529C', name: 'Blue', meaning: 'Atlantic Ocean' },
                    { color: '#FFFFFF', name: 'White', meaning: 'Snow & ice' },
                    { color: '#DC1E35', name: 'Red', meaning: 'Volcanic fire' }
                ],
                similar: ['NOR', 'DNK'] // Nordic cross flags
            },
            'HUN': {
                mnemonic: "🌶️ Red-White-Green horizontal (top to bottom). Like paprika! Iran is Green-White-Red",
                colors: [
                    { color: '#CE2939', name: 'Red', meaning: 'Strength' },
                    { color: '#FFFFFF', name: 'White', meaning: 'Faithfulness' },
                    { color: '#477050', name: 'Green', meaning: 'Hope' }
                ],
                similar: ['IRN', 'ITA', 'BGR'] // Similar stripes
            },
            'IRN': {
                mnemonic: "🕌 Green-White-Red horizontal. Green on TOP (Islam first). Opposite of Hungary!",
                colors: [
                    { color: '#239F40', name: 'Green', meaning: 'Islam & growth' },
                    { color: '#FFFFFF', name: 'White', meaning: 'Peace' },
                    { color: '#DA0000', name: 'Red', meaning: 'Martyrdom' }
                ],
                similar: ['HUN', 'TJK'] // Hungary has red on top
            },
            'LUX': {
                mnemonic: "🏦 Red-White-Light Blue horizontal. Like Netherlands but LIGHTER blue (Lux = Light!)",
                colors: [
                    { color: '#EF3340', name: 'Red', meaning: 'Grand Duke' },
                    { color: '#FFFFFF', name: 'White', meaning: 'Peace' },
                    { color: '#00A1DE', name: 'Light Blue', meaning: 'Freedom' }
                ],
                similar: ['NLD'] // Netherlands has darker blue
            }
        };

export default FLAG_HINTS;
