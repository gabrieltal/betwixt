# This file should contain all the record creation needed to seed the database with its default values.
# The data can then be loaded with the rails db:seed command (or created alongside the database with db:setup).
#
# Examples:
#
#   movies = Movie.create([{ name: 'Star Wars' }, { name: 'Lord of the Rings' }])
#   Character.create(name: 'Luke', movie: movies.first)
User.create({username: 'guest', password: 'password'})
User.create({username: 'gabriel', password: 'password'})
User.create({username: 'Albert Camus', password: 'password', bio: 'Life is the sum of all your choices',
  image: File.open(File.join(Rails.root, '/app/assets/images/coffee-1030971_640.jpg'))  })
User.create({username: 'George Orwell', password: 'password', bio: 'Happniess can exist only in acceptance',
  image: File.open(File.join(Rails.root, '/app/assets/images/eric-blair-3176730_640.png')) })
User.create({username: 'George R.R. Martin', password: 'password', bio: 'It is one thing to be clever and another to be wise',
  image: File.open(File.join(Rails.root, '/app/assets/images/turtle-182121_640.jpg')) })
User.create({username: 'Arthur C. Clarke', password: 'password', bio: 'Any sufficiently advanced technology is indistinguishable from magic.',
  image: File.open(File.join(Rails.root, '/app/assets/images/rocket-3309711_640.png')) })
Story.create({title: '1984', author_id: 4, body: "Part 1, Chapter 1

Part One


1
It was a bright cold day in April, and the clocks were striking thirteen. Winston Smith, his chin nuzzled into his breast in an effort to escape the vile wind, slipped quickly through the glass doors of Victory Mansions, though not quickly enough to prevent a swirl of gritty dust from entering along with him.

The hallway smelt of boiled cabbage and old rag mats. At one end of it a coloured poster, too large for indoor display, had been tacked to the wall. It depicted simply an enormous face, more than a metre wide: the face of a man of about forty-five, with a heavy black moustache and ruggedly handsome features. Winston made for the stairs. It was no use trying the lift. Even at the best of times it was seldom working, and at present the electric current was cut off during daylight hours. It was part of the economy drive in preparation for Hate Week. The flat was seven flights up, and Winston, who was thirty-nine and had a varicose ulcer above his right ankle, went slowly, resting several times on the way. On each landing, opposite the lift-shaft, the poster with the enormous face gazed from the wall. It was one of those pictures which are so contrived that the eyes follow you about when you move. BIG BROTHER IS WATCHING YOU, the caption beneath it ran.

Inside the flat a fruity voice was reading out a list of figures which had something to do with the production of pig-iron. The voice came from an oblong metal plaque like a dulled mirror which formed part of the surface of the right-hand wall. Winston turned a switch and the voice sank somewhat, though the words were still distinguishable. The instrument (the telescreen, it was called) could be dimmed, but there was no way of shutting it off completely. He moved over to the window: a smallish, frail figure, the meagreness of his body merely emphasized by the blue overalls which were the uniform of the party. His hair was very fair, his face naturally sanguine, his skin roughened by coarse soap and blunt razor blades and the cold of the winter that had just ended.

Outside, even through the shut window-pane, the world looked cold. Down in the street little eddies of wind were whirling dust and torn paper into spirals, and though the sun was shining and the sky a harsh blue, there seemed to be no colour in anything, except the posters that were plastered everywhere. The blackmoustachio'd face gazed down from every commanding corner. There was one on the house-front immediately opposite. BIG BROTHER IS WATCHING YOU, the caption said, while the dark eyes looked deep into Winston's own. Down at streetlevel another poster, torn at one corner, flapped fitfully in the wind, alternately covering and uncovering the single word INGSOC. In the far distance a helicopter skimmed down between the roofs, hovered for an instant like a bluebottle, and darted away again with a curving flight. It was the police patrol, snooping into people's windows. The patrols did not matter, however. Only the Thought Police mattered.

Behind Winston's back the voice from the telescreen was still babbling away about pig-iron and the overfulfilment of the Ninth Three-Year Plan. The telescreen received and transmitted simultaneously. Any sound that Winston made, above the level of a very low whisper, would be picked up by it, moreover, so long as he remained within the field of vision which the metal plaque commanded, he could be seen as well as heard. There was of course no way of knowing whether you were being watched at any given moment. How often, or on what system, the Thought Police plugged in on any individual wire was guesswork. It was even conceivable that they watched everybody all the time. But at any rate they could plug in your wire whenever they wanted to. You had to live -- did live, from habit that became instinct -- in the assumption that every sound you made was overheard, and, except in darkness, every movement scrutinized.

Winston kept his back turned to the telescreen. It was safer, though, as he well knew, even a back can be revealing. A kilometre away the Ministry of Truth, his place of work, towered vast and white above the grimy landscape. This, he thought with a sort of vague distaste -- this was London, chief city of Airstrip One, itself the third most populous of the provinces of Oceania. He tried to squeeze out some childhood memory that should tell him whether London had always been quite like this. Were there always these vistas of rotting nineteenth-century houses, their sides shored up with baulks of timber, their windows patched with cardboard and their roofs with corrugated iron, their crazy garden walls sagging in all directions? And the bombed sites where the plaster dust swirled in the air and the willow-herb straggled over the heaps of rubble; and the places where the bombs had cleared a larger patch and there had sprung up sordid colonies of wooden dwellings like chicken-houses? But it was no use, he could not remember: nothing remained of his childhood except a series of bright-lit tableaux occurring against no background and mostly unintelligible.

The Ministry of Truth -- Minitrue, in Newspeak -- was startlingly different from any other object in sight. It was an enormous pyramidal structure of glittering white concrete, soaring up, terrace after terrace, 300 metres into the air. From where Winston stood it was just possible to read, picked out on its white face in elegant lettering, the three slogans of the Party:

WAR IS PEACE

FREEDOM IS SLAVERY

IGNORANCE IS STRENGTH
The Ministry of Truth contained, it was said, three thousand rooms above ground level, and corresponding ramifications below. Scattered about London there were just three other buildings of similar appearance and size. So completely did they dwarf the surrounding architecture that from the roof of Victory Mansions you could see all four of them simultaneously. They were the homes of the four Ministries between which the entire apparatus of government was divided. The Ministry of Truth, which concerned itself with news, entertainment, education, and the fine arts. The Ministry of Peace, which concerned itself with war. The Ministry of Love, which maintained law and order. And the Ministry of Plenty, which was responsible for economic affairs. Their names, in Newspeak: Minitrue, Minipax, Miniluv, and Miniplenty.

The Ministry of Love was the really frightening one. There were no windows in it at all. Winston had never been inside the Ministry of Love, nor within half a kilometre of it. It was a place impossible to enter except on official business, and then only by penetrating through a maze of barbed-wire entanglements, steel doors, and hidden machine-gun nests. Even the streets leading up to its outer barriers were roamed by gorilla-faced guards in black uniforms, armed with jointed truncheons.

Winston turned round abruptly. He had set his features into the expression of quiet optimism which it was advisable to wear when facing the telescreen. He crossed the room into the tiny kitchen. By leaving the Ministry at this time of day he had sacrificed his lunch in the canteen, and he was aware that there was no food in the kitchen except a hunk of dark-coloured bread which had got to be saved for tomorrow's breakfast. He took down from the shelf a bottle of colourless liquid with a plain white label marked VICTORY GIN. It gave off a sickly, oily smell, as of Chinese ricespirit. Winston poured out nearly a teacupful, nerved himself for a shock, and gulped it down like a dose of medicine.

Instantly his face turned scarlet and the water ran out of his eyes. The stuff was like nitric acid, and moreover, in swallowing it one had the sensation of being hit on the back of the head with a rubber club. The next moment, however, the burning in his belly died down and the world began to look more cheerful. He took a cigarette from a crumpled packet marked VICTORY CIGARETTES and incautiously held it upright, whereupon the tobacco fell out on to the floor. With the next he was more successful. He went back to the living-room and sat down at a small table that stood to the left of the telescreen. From the table drawer he took out a penholder, a bottle of ink, and a thick, quarto-sized blank book with a red back and a marbled cover.

For some reason the telescreen in the living-room was in an unusual position. Instead of being placed, as was normal, in the end wall, where it could command the whole room, it was in the longer wall, opposite the window. To one side of it there was a shallow alcove in which Winston was now sitting, and which, when the flats were built, had probably been intended to hold bookshelves. By sitting in the alcove, and keeping well back, Winston was able to remain outside the range of the telescreen, so far as sight went. He could be heard, of course, but so long as he stayed in his present position he could not be seen. It was partly the unusual geography of the room that had suggested to him the thing that he was now about to do.

But it had also been suggested by the book that he had just taken out of the drawer. It was a peculiarly beautiful book. Its smooth creamy paper, a little yellowed by age, was of a kind that had not been manufactured for at least forty years past. He could guess, however, that the book was much older than that. He had seen it lying in the window of a frowsy little junk-shop in a slummy quarter of the town (just what quarter he did not now remember) and had been stricken immediately by an overwhelming desire to possess it. Party members were supposed not to go into ordinary shops ('dealing on the free market', it was called), but the rule was not strictly kept, because there were various things, such as shoelaces and razor blades, which it was impossible to get hold of in any other way. He had given a quick glance up and down the street and then had slipped inside and bought the book for two dollars fifty. At the time he was not conscious of wanting it for any particular purpose. He had carried it guiltily home in his briefcase. Even with nothing written in it, it was a compromising possession.

The thing that he was about to do was to open a diary. This was not illegal (nothing was illegal, since there were no longer any laws), but if detected it was reasonably certain that it would be punished by death, or at least by twenty-five years in a forced-labour camp. Winston fitted a nib into the penholder and sucked it to get the grease off. The pen was an archaic instrument, seldom used even for signatures, and he had procured one, furtively and with some difficulty, simply because of a feeling that the beautiful creamy paper deserved to be written on with a real nib instead of being scratched with an ink-pencil. Actually he was not used to writing by hand. Apart from very short notes, it was usual to dictate everything into the speakwrite which was of course impossible for his present purpose. He dipped the pen into the ink and then faltered for just a second. A tremor had gone through his bowels. To mark the paper was the decisive act. In small clumsy letters he wrote:

April 4th, 1984.

He sat back. A sense of complete helplessness had descended upon him. To begin with, he did not know with any certainty that this was 1984. It must be round about that date, since he was fairly sure that his age was thirty-nine, and he believed that he had been born in 1944 or 1945; but it was never possible nowadays to pin down any date within a year or two.

For whom, it suddenly occurred to him to wonder, was he writing this diary? For the future, for the unborn. His mind hovered for a moment round the doubtful date on the page, and then fetched up with a bump against the Newspeak word doublethink. For the first time the magnitude of what he had undertaken came home to him. How could you communicate with the future? It was of its nature impossible. Either the future would resemble the present, in which case it would not listen to him: or it would be different from it, and his predicament would be meaningless.

For some time he sat gazing stupidly at the paper. The telescreen had changed over to strident military music. It was curious that he seemed not merely to have lost the power of expressing himself, but even to have forgotten what it was that he had originally intended to say. For weeks past he had been making ready for this moment, and it had never crossed his mind that anything would be needed except courage. The actual writing would be easy. All he had to do was to transfer to paper the interminable restless monologue that had been running inside his head, literally for years. At this moment, however, even the monologue had dried up. Moreover his varicose ulcer had begun itching unbearably. He dared not scratch it, because if he did so it always became inflamed. The seconds were ticking by. He was conscious of nothing except the blankness of the page in front of him, the itching of the skin above his ankle, the blaring of the music, and a slight booziness caused by the gin.

Suddenly he began writing in sheer panic, only imperfectly aware of what he was setting down. His small but childish handwriting straggled up and down the page, shedding first its capital letters and finally even its full stops:

April 4th, 1984. Last night to the flicks. All war films. One very good one of a ship full of refugees being bombed somewhere in the Mediterranean. Audience much amused by shots of a great huge fat man trying to swim away with a helicopter after him, first you saw him wallowing along in the water like a porpoise, then you saw him through the helicopters gunsights, then he was full of holes and the sea round him turned pink and he sank as suddenly as though the holes had let in the water, audience shouting with laughter when he sank. then you saw a lifeboat full of children with a helicopter hovering over it. there was a middle-aged woman might have been a jewess sitting up in the bow with a little boy about three years old in her arms. little boy screaming with fright and hiding his head between her breasts as if he was trying to burrow right into her and the woman putting her arms round him and comforting him although she was blue with fright herself, all the time covering him up as much as possible as if she thought her arms could keep the bullets off him. then the helicopter planted a 20 kilo bomb in among them terrific flash and the boat went all to matchwood. then there was a wonderful shot of a child's arm going up up up right up into the air a helicopter with a camera in its nose must have followed it up and there was a lot of applause from the party seats but a woman down in the prole part of the house suddenly started kicking up a fuss and shouting they didnt oughter of showed it not in front of kids they didnt it aint right not in front of kids it aint until the police turned her turned her out i dont suppose anything happened to her nobody cares what the proles say typical prole reaction they never --

Winston stopped writing, partly because he was suffering from cramp. He did not know what had made him pour out this stream of rubbish. But the curious thing was that while he was doing so a totally different memory had clarified itself in his mind, to the point where he almost felt equal to writing it down. It was, he now realized, because of this other incident that he had suddenly decided to come home and begin the diary today.

It had happened that morning at the Ministry, if anything so nebulous could be said to happen. ",
 image: File.open(File.join(Rails.root, '/app/assets/images/paul-morris-184484-unsplash.jpg')) })

Story.create({title: 'A Game of Thrones', author_id: 5, body: "We should start back,' Gared urged as the woods began to grow dark around them. “The wildlings are dead.'

“Do the dead frighten you?' Ser Waymar Royce asked with just the hint of a smile.

Gared did not rise to the bait. He was an old man, past fifty, and he had seen the lordlings come and go. “Dead is dead,' he said. “We have no business with the dead.'

“Are they dead?' Royce asked softly. “What proof have we?'

“Will saw them,' Gared said. “If he says they are dead, that’s proof enough for me.'

Will had known they would drag him into the quarrel sooner or later. He wished it had been later rather than sooner. “My mother told me that dead men sing no songs,' he put in.

“My wet nurse said the same thing, Will,' Royce replied. “Never believe anything you hear at a woman’s tit. There are things to be learned even from the dead.' His voice echoed, too loud in the twilit forest.

“We have a long ride before us,' Gared pointed out. “Eight days, maybe nine. And night is falling.'

Ser Waymar Royce glanced at the sky with disinterest. “It does that every day about this time. Are you unmanned by the dark, Gared?'

Will could see the tightness around Gared’s mouth, the barely suppressed anger in his eyes under the thick black hood of his cloak. Gared had spent forty years in the Night's Watch, man and boy, and he was not accustomed to being made light of. Yet it was more than that. Under the wounded pride, Will could sense something else in the older man. You could taste it; a nervous tension that came perilous close to fear.

Will shared his unease. He had been four years on the Wall. The first time he had been sent beyond, all the old stories had come rushing back, and his bowels had turned to water. He had laughed about it afterward. He was a veteran of a hundred rangings by now, and the endless dark wilderness that the southron called the haunted forest had no more terrors for him.

Until tonight. Something was different tonight. There was an edge to this darkness that made his hackles rise. Nine days they had been riding, north and northwest and then north again, farther and farther from the Wall, hard on the track of a band of wildling raiders. Each day had been worse than the day that had come before it. Today was the worst of all. A cold wind was blowing out of the north, and it made the trees rustle like living things. All day, Will had felt as though something were watching him, something cold and implacable that loved him not. Gared had felt it too. Will wanted nothing so much as to ride hellbent for the safety of the Wall, but that was not a feeling to share with your commander.",
image: File.open(File.join(Rails.root, '/app/assets/images/armor-close-up-combat-161936.jpg')) })

Story.create({title: 'The Stranger', author_id: 3, body: "MOTHER died today. Or, maybe, yesterday; I can’t be sure. The telegram from the
Home says: YOUR MOTHER PASSED AWAY. FUNERAL TOMORROW. DEEP
SYMPATHY. Which leaves the matter doubtful; it could have been yesterday.
The Home for Aged Persons is at Marengo, some fifty miles from Algiers. With
the two o’clock bus I should get there well before nightfall. Then I can spend the
night there, keeping the usual vigil beside the body, and be back here by tomorrow
evening. I have fixed up with my employer for two days’ leave; obviously, under the
circumstances, he couldn’t refuse. Still, I had an idea he looked annoyed, and I said,
without thinking: “Sorry, sir, but it’s not my fault, you know.”
Afterwards it struck me I needn’t have said that. I had no reason to excuse myself;
it was up to him to express his sympathy and so forth. Probably he will do so the day
after tomorrow, when he sees me in black. For the present, it’s almost as if Mother
weren’t really dead. The funeral will bring it home to me, put an official seal on it, so
to speak. ...
I took the two-o’clock bus. It was a blazing hot afternoon. I’d lunched, as usual, at
Céleste’s restaurant. Everyone was most kind, and Céleste said to me, “There’s no
one like a mother.” When I left they came with me to the door. It was something of a
rush, getting away, as at the last moment I had to call in at Emmanuel’s place to
borrow his black tie and mourning band. He lost his uncle a few months ago.
I had to run to catch the bus. I suppose it was my hurrying like that, what with the
glare off the road and from the sky, the reek of gasoline, and the jolts, that made me
feel so drowsy. Anyhow, I slept most of the way. When I woke I was leaning against
a soldier; he grinned and asked me if I’d come from a long way off, and I just
nodded, to cut things short. I wasn’t in a mood for talking.
The Home is a little over a mile from the village. I went there on foot. I asked to
be allowed to see Mother at once, but the doorkeeper told me I must see the warden
first. He wasn’t free, and I had to wait a bit. The doorkeeper chatted with me while I
waited; then he led me to the office. The warden was a very small man, with gray
hair, and a Legion of Honor rosette in his buttonhole. He gave me a long look with
his watery blue eyes. Then we shook hands, and he held mine so long that I began to
feel embarrassed. After that he consulted a register on his table, and said:
“Madame Meursault entered the Home three years ago. She had no private means
and depended entirely on you.", image: File.open(File.join(Rails.root, '/app/assets/images/elisabetta-foco-241-unsplash.jpg'))  })

Story.create({title: '2001: A Space Odyssey', author_id: 6, body: "The drought had lasted now for ten million years, and the reign of the terrible lizards had
long since ended. Here on the Equator, in the continent which would one day be known as Africa,
the battle for existence had reached a new climax of ferocity, and the victor was not yet in
sight. In this barren and desiccated land, only the small or the swift or the fierce could
flourish, or even hope to survive.
 The man-apes of the veldt were none of these things, and they were not flourishing. Indeed,
they were already far down the road to racial extinction. About fifty of them occupied a group of
caves overlooking a small, parched valley, which was divided by a sluggish stream fed from snows
in the mountains two hundred miles to the north. In bad times the stream vanished completely, and
the tribe lived in the shadow of thirst.
 It was always hungry, and now it was starving. When the first faint glow of dawn crept into
the cave, Moon-Watcher saw that his father had died in the night. He did not know that the Old One
was his father, for such a relationship was utterly beyond his understanding, but as he looked at
the emaciated body he felt dim disquiet that was the ancestor of sadness.
 The two babies were already whimpering for food, but became silent when Moon-Watcher snarled
at them. One of the mothers, defending the infant she could not properly feed, gave him an angry
growl in return; he lacked the energy even to cuff her for her presumption.
 Now it was light enough to leave. Moon-Watcher picked up the shriveled corpse and dragged it
after him as he bent under the low overhang of the cave. Once outside, he threw the body over his
shoulder and stood upright - the only animal in all this world able to do so.
 Among his kind, Moon-Watcher was almost a giant. He was nearly five feet high, and though
badly undernourished weighed over a hundred pounds. His hairy, muscular body was halfway between
ape and man, but his head was already much nearer to man than ape. The forehead was low, and there
were ridges over the eye sockets, yet he unmistakably held in his genes the promise of humanity.
As he looked out upon the hostile world of the Pleistocene, there was already something in his
gaze beyond the capacity of any ape. In those dark, deep-set eyes was a dawning awareness - the
first intimations of an intelligence that could not possibly fulfill itself for ages yet, and
might soon be extinguished forever.
 There was no sign of danger, so Moon-Watcher began to scramble down the almost vertical slope
outside the cave, only slightly hindered by his burden. As if they had been waiting for his
signal, the rest of the tribe emerged from their own homes farther down the rock face, and began
to hasten toward the muddy waters of the stream for their morning drink.
 Moon-Watcher looked across the valley to see if the Others were in sight, but there was no
trace of them. Perhaps they had not yet left their caves, or were already foraging farther along
the hillside. Since they were nowhere to be seen, Moon-Watcher forgot them; he was incapable of
worrying about more than one thing at a time.
 First he must get rid of the Old One, but this was a problem that demanded little thought.
There had been many deaths this season, one of them in his own cave; he had only to put the corpse
where he had left the new baby at the last quarter of the moon, and the hyenas would do the rest.
 They were already waiting, where the little valley fanned out into the savanna, almost as if
they had known that he was coming. Moon-Watcher left the body under a small bush - all the earlier
bones were already gone - and hurried back to rejoin the tribe. He never thought of his father
again.
 His two mates, the adults from the other caves, and most of the youngsters were foraging among
the drought-stunted trees farther up the valley, looking for berries, succulent roots and leaves,
and occasional windfalls like small lizards or rodents. Only the babies and the feeblest of the
old folk were left in the caves; if there was any surplus food at the end of the day's searching,
they might be fed. If not, the hyenas would soon be in luck once more.",
image: File.open(File.join(Rails.root, '/app/assets/images/astronomy-nasa-nebula-41951.jpg')) })
