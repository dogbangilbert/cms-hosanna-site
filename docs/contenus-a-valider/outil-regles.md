# Outil « Mes règles sont-elles normales ? » : fiche à valider

**Statut : mis en ligne le 22/11/2026 sur décision de Gilbert DOGBAN (« En ligne gynéco »).** Page `regles.html` (adresse `/regles`), présente sur la page `/outils`. **Indexation à activer après relecture finale de Gilbert** : la page reste en `noindex`, hors `sitemap.xml` et hors `llms.txt` jusque-là.
Outil d'**orientation**, pas de diagnostic. Tout le calcul se fait dans le navigateur : les réponses ne sont ni enregistrées ni envoyées. Seul le compteur anonyme du site est appelé (`regles_resultat` au résultat, `imprimer_clic`, `rdv_whatsapp_clic`) : nom de l'événement, page et jour, rien d'autre (voir `docs/compteur-utilisation.md`). Phrase affichée (correction de Gilbert, 22/11) : « Vos réponses sont uniquement avec vous et ne vont nulle part ailleurs. Nous comptons seulement le nombre d'utilisations, de façon anonyme. »

## 1. Parcours (questionnaire par étapes)

Barre de progression « Étape X sur N ». Les étapes inutiles sont retirées selon la réponse « Vos règles en ce moment » :

| Réponse | Étapes |
|---|---|
| Mes règles viennent | 1 Vous · 2 Vos cycles · 3 Abondance et saignements · 4 Douleurs · 5 Signes d'alerte |
| Mes règles se sont arrêtées | 1 Vous · 2 Arrêt des règles · 3 Signes d'alerte |
| Je n'ai jamais eu mes règles | 1 Vous · 2 Signes d'alerte |

Au-dessus du questionnaire, en permanence : « **Saignement très abondant, malaise ou forte douleur ?** N'attendez pas : consultez tout de suite un service de santé. Le CMS HOSANNA est ouvert 24h/24 au 90 03 83 13. »

## 2. Saisies

| Étape | Question | Valeurs acceptées |
|---|---|---|
| Vous | Âge | 9 à 60 ans |
| | Vos règles en ce moment | viennent / arrêtées / jamais eues |
| | Âge des premières règles (facultatif, masqué si « jamais ») | 8 à 18 ans, pas plus que l'âge |
| | Contraception actuelle | aucune ou préservatif / pilule / injection / implant / stérilet hormonal / stérilet au cuivre |
| | Allaitez-vous ? | non / oui |
| | Une grossesse est-elle possible ? | non / oui / je ne sais pas |
| Arrêt des règles | Depuis combien de mois ? | 1 à 240 |
| | Avant l'arrêt, règles régulières ? | oui / non |
| | Des saignements sont réapparus depuis l'arrêt | case |
| Vos cycles | Durée habituelle du cycle | 10 à 120 jours |
| | Durée des règles | 1 à 30 jours |
| | Écart entre le cycle le plus court et le plus long | 0-7 j / 8-9 j / 10 j ou plus / je ne sais pas |
| Abondance | Garnitures (serviettes, garnitures ou pagnes) changées en 24 h au jour le plus abondant | 0 à 40 (facultatif) |
| | Cases : pleine en 2 h ou moins ; caillots plus gros qu'une pièce de 100 F CFA ; se lever la nuit ou double protection ; sang qui tache linge, pagne, matelas ou draps ; règles très peu abondantes | |
| | Saignements entre les règles ; après les rapports | cases |
| Douleurs | Intensité | aucune / légère / modérée / forte |
| | Jours de douleur par cycle | 0 à 20 (facultatif) |
| | Depuis quand ? | je ne sais pas / depuis les premières règles / apparue plus tard |
| | Cases : manque l'école ou le travail ; antidouleurs inefficaces ; s'aggrave avec les années ; douleur pendant les rapports ; douleur à la selle ou en urinant pendant les règles ; douleur du bas-ventre en dehors des règles | |
| Signes d'alerte | Malaise, vertiges, évanouissement, essoufflement ; garniture remplie chaque heure depuis 2 h ou plus ; douleur très forte et brutale ; fièvre ou pertes malodorantes | cases |

Saisies refusées (message affiché, curseur sur le champ, passage à l'étape suivante bloqué) : âge hors limites, premières règles hors limites ou après l'âge, mois d'arrêt manquant, cycle ou durée manquants ou hors limites, garnitures > 40, jours de douleur > 20, « très peu abondantes » cochée avec 4 garnitures ou plus, « pleine en 2 h » ou « tache le linge ».

## 3. Règles de décision, seuils et sources

### 3.1 Niveaux d'orientation

| Niveau | Affichage | Quand |
|---|---|---|
| Vert | « Vert · repères habituels » | aucune anomalie, ou seulement : hypoménorrhée, dysménorrhée légère ou modérée sans signe associé, retard de règles, ménopause probable, absence de règles de l'allaitement, saignements modifiés par la contraception hormonale |
| Orange (1 mois) | « Orange · consultez dans le mois » | polyménorrhée, oligoménorrhée, cycles irréguliers, règles prolongées, aménorrhée primaire ou secondaire, dysménorrhée invalidante, signes à explorer (endométriose) |
| Orange (2 semaines) | « Orange · consultez dans les 2 semaines » | règles abondantes, métrorragies, saignements après les rapports, saignement après la ménopause |
| Rouge | « Rouge · urgence : consultez maintenant » + encadré rouge | une case de l'étape « Signes d'alerte » cochée ; **ou** grossesse possible (oui ou je ne sais pas) avec saignement anormal (abondant, prolongé, entre les règles, après les rapports, réapparu) ou forte douleur (invalidante ou brutale) |

Le rouge l'emporte toujours, y compris sous contraception : l'outil ne rassure jamais une patiente qui coche un signe d'alerte.

### 3.2 Seuils

| Élément | Règle | Source |
|---|---|---|
| Fréquence normale | 24 à 38 jours ; < 24 = polyménorrhée (« fréquent ») ; > 38 = oligoménorrhée (« peu fréquent ») | FIGO 2018 (Munro et al.) [1] ; définition actuelle retenue par Gilbert le 22/11/2026 |
| Adolescentes (premières règles depuis moins de 3 ans) | normal 21 à 45 jours ; l'irrégularité n'est pas signalée (message d'explication) | ACOG, avis n° 651, 2015 [2] |
| Régularité | écart ≤ 7 jours normal ; ≤ 9 jours normal avant 26 ans et à partir de 42 ans ; au-delà = irrégulier | FIGO 2018 [1] |
| Durée | > 8 jours = règles prolongées ; > 7 jours chez l'adolescente (premières règles depuis moins de 3 ans) | FIGO 2018 [1] ; ACOG 651 [2] et manuels francophones (décision de Gilbert, 21/11 : « ce qui est proche de nous ») |
| Abondance (définition) | > 80 mL par cycle (Higham) ou abondance qui gêne la vie quotidienne | Higham 1990 [3] ; CNGOF 2008 et 2022 [4] ; NICE NG88 [5] |
| Abondance (indices retenus) | **un seul** suffit : ≥ 4 garnitures en 24 h au jour le plus abondant (décision de Gilbert, 21/11) ; pleine en 2 h ou moins ; caillots > pièce de 100 F CFA (environ 2,5 cm) ; change la nuit ou double protection ; débordement sur linge ou draps | Warner 2004 [6] (caillots ≥ 2,5 cm, change plus souvent que toutes les 3 h, débordements) ; NHS [7]. Seuil de 4 garnitures : décision de Gilbert DOGBAN (pratique de terrain au CMS HOSANNA : 1 à 3 garnitures par jour est l'usage habituel) |
| Aménorrhée primaire | pas de règles à 15 ans ; à 13 ans sans développement des seins (texte) | ASRM 2024 [8] |
| Aménorrhée secondaire | > 3 mois si cycles réguliers avant, > 6 mois si irréguliers | ASRM 2024 [8] |
| Ménopause | ≥ 45 ans et ≥ 12 mois sans règles, hors contraception hormonale et allaitement | OMS 1996 [9] |
| Allaitement | absence de règles normale ; rappel de la MAMA (bébé < 6 mois, allaitement exclusif, pas de retour des règles) | OMS, manuel de planification familiale [10] |
| Contraception hormonale | absence de règles ou saignements irréguliers, rares, légers ou intercurrents attribués à la méthode (vert), sauf saignement après les rapports, règles abondantes ou prolongées, douleurs (restent orange) ; consulter s'ils durent plus de 3 mois, changent brusquement ou s'accompagnent de douleurs | FSRH 2015 [11] ; FIGO 2018 exclut ces situations des normes [1] |
| Saignement après les rapports | toujours orange (2 semaines), examen du col et dépistage | FIGO 2018 [1] ; bonne pratique |
| Dysménorrhée | légère ou modérée : vert ; invalidante (forte ou absence école/travail) : orange ; douleur > 3 jours : signalée | SOGC 2017 [12] (douleur de 8 à 72 h) |
| Signes à explorer (endométriose ou autre cause) | antidouleurs inefficaces, aggravation, douleur apparue tardivement, douleur aux rapports, à la selle ou en urinant, douleur hors règles → orange, sans parler de diagnostic | ACOG 760, 2018 [13] ; ESHRE 2022 [14] |
| Grossesse possible + saignement ou forte douleur | rouge (fausse couche ou grossesse extra-utérine à éliminer) | bonne pratique |

## 4. Sources

1. Munro MG, Critchley HOD, Fraser IS ; FIGO Menstrual Disorders Committee. *The two FIGO systems for normal and abnormal uterine bleeding symptoms and classification of causes of abnormal uterine bleeding in the reproductive years: 2018 revisions.* Int J Gynecol Obstet 2018;143:393-408. https://pubmed.ncbi.nlm.nih.gov/30198563/
2. ACOG Committee Opinion n° 651, *Menstruation in Girls and Adolescents: Using the Menstrual Cycle as a Vital Sign*, 2015. https://www.acog.org/clinical/clinical-guidance/committee-opinion/articles/2015/12/menstruation-in-girls-and-adolescents-using-the-menstrual-cycle-as-a-vital-sign (*lien non ouvert pendant ce travail, à vérifier*)
3. Higham JM, O'Brien PMS, Shaw RW. *Assessment of menstrual blood loss using a pictorial chart.* BJOG 1990;97:734-9 (score PBAC ≥ 100 ≈ 80 mL). https://pubmed.ncbi.nlm.nih.gov/2400752/
4. CNGOF. *Recommandations pour la pratique clinique : ménométrorragies*, 2008 (perte > 80 mL). https://cngof.fr/wp/../app/pdf/RPC//RPC%20DU%20CNGOF/2008/081204RPC_menometro.pdf ; CNGOF. *RPC Ménorragies*, Gynécol Obstét Fertil Sénol 2022;50:345-373. https://pubmed.ncbi.nlm.nih.gov/35248756/
5. NICE. *Heavy menstrual bleeding: assessment and management* (NG88), 2018, mise à jour 2021 : définition par le retentissement sur la qualité de vie. https://www.nice.org.uk/guidance/ng88
6. Warner PE et al. *Menorrhagia I: measured blood loss, clinical features, and outcome in women with heavy periods.* Am J Obstet Gynecol 2004;190:1216-23 (*référence citée de mémoire, à vérifier*).
7. NHS. *Heavy periods* (changer de protection toutes les 1 à 2 h, caillots > 2,5 cm, débordements). https://www.nhs.uk/conditions/heavy-periods/ (*lien non ouvert pendant ce travail, à vérifier*)
8. ASRM Practice Committee. *Current evaluation of amenorrhea: a committee opinion.* Fertil Steril 2024;122:52-61. https://www.asrm.org/practice-guidance/practice-committee-documents/current-evaluation-of-amenorrhea/
9. OMS. *Research on the menopause in the 1990s.* Série de rapports techniques 866, 1996.
10. OMS et Johns Hopkins CCP. *Planification familiale : un manuel à l'intention des prestataires de services du monde entier*, éd. 2022, chapitre MAMA.
11. FSRH. *Clinical Guideline: Problematic Bleeding with Hormonal Contraception*, 2015 (*référence citée de mémoire, à vérifier*).
12. Burnett M, Lemyre M. *No. 345 – Primary Dysmenorrhea Consensus Guideline.* J Obstet Gynaecol Can 2017;39:585-595 (*référence citée de mémoire, à vérifier*).
13. ACOG Committee Opinion n° 760. *Dysmenorrhea and Endometriosis in the Adolescent.* Obstet Gynecol 2018;132:e249-e258. https://pubmed.ncbi.nlm.nih.gov/30461694/
14. ESHRE. *ESHRE guideline: endometriosis.* Hum Reprod Open 2022;hoac009. https://pubmed.ncbi.nlm.nih.gov/35350465/

**Contexte africain.** Aucune étude validant un seuil de « nombre de pagnes ou garnitures » en Afrique de l'Ouest n'a été trouvée. Données voisines : une étude multipays avec l'échelle SAMANTA (dont Dakar, Nairobi, Kampala) retrouve des règles abondantes chez 38 à 49 % des femmes (https://pmc.ncbi.nlm.nih.gov/articles/PMC10581908) ; une revue de 2025 sur les règles abondantes en Afrique souligne leur sous-déclaration (https://www.ncbi.nlm.nih.gov/pmc/articles/PMC12369733/). C'est pourquoi l'outil s'appuie surtout sur les signes (débordement, caillots, change la nuit) et présente le nombre de garnitures comme un indice.

## 5. Textes affichés (mot à mot)

`[X]` = valeur saisie ou calculée.

**Encadré rouge** : « **Consultez en urgence, sans attendre :** vous signalez [signes cochés]. Une grossesse est possible : un saignement ou une forte douleur peut venir d'une fausse couche ou d'une grossesse extra-utérine, qui doivent être recherchées tout de suite. Le CMS HOSANNA est ouvert 24h/24 : 90 03 83 13. » (chaque phrase n'apparaît que si elle s'applique)

**Phrase de fin selon le niveau** : vert « Pas de consultation urgente nécessaire. Consultez si quelque chose change ou vous inquiète. » ; orange « Une consultation est conseillée dans le mois qui vient. » / « … dans les 2 semaines. » ; rouge « Consultez sans attendre. »

**Jamais de règles**
- ≥ 15 ans : « Aménorrhée primaire : pas de règles à [X] ans (repère : 15 ans). Une consultation permet d'en trouver la cause, souvent traitable : examen, échographie et quelques analyses. »
- < 15 ans : « À [X] ans, ne pas encore avoir ses règles peut être normal. Consultez si elles ne sont pas venues à 15 ans, ou dès 13 ans si la poitrine n'a pas commencé à se développer. »

**Règles arrêtées**
- Grossesse possible : « Une grossesse est la cause la plus fréquente d'un arrêt des règles : faites d'abord un test de grossesse (en pharmacie ou au centre). »
- Allaitement : « Vous allaitez : l'absence de règles est normale pendant l'allaitement. Attention, l'allaitement ne protège d'une grossesse que si le bébé a moins de 6 mois, est nourri uniquement au sein, jour et nuit, et si les règles ne sont pas revenues. Sinon, parlez de contraception avec un professionnel. »
- Contraception hormonale : « Sous [la pilule / l'injection / l'implant / le stérilet hormonal], l'absence de règles est fréquente et sans danger : la méthode met l'utérus au repos. » + pilule : « Sous pilule, faites un test de grossesse en cas d'oubli de comprimés. » + ≥ 45 ans : « La ménopause ne peut pas être affirmée sous contraception hormonale : parlez-en au médecin. »
- Ménopause : « Ménopause probable : pas de règles depuis [X] mois à [X] ans. Une consultation permet de faire le point (bouffées de chaleur, os, cœur, dépistages). »
- Aménorrhée secondaire : « Aménorrhée secondaire : pas de règles depuis [X] mois (repère : plus de [3 ou 6] mois). Une consultation permet d'en chercher la cause : stress, perte ou prise de poids, trouble hormonal, thyroïde, ovaires polykystiques… » + ≥ 45 ans : « À [X] ans, l'approche de la ménopause est aussi possible. »
- Retard : « Retard de règles de [X] mois : ce n'est pas encore une aménorrhée (repère : plus de [3 ou 6] mois). Consultez si les règles ne reviennent pas. »
- Saignement après la ménopause : « Un saignement après la ménopause doit toujours être examiné, même s'il est léger : examen et échographie. » ; sinon : « Les saignements réapparus seront à décrire au médecin (date, durée, abondance). »

**Règles qui viennent**
- Polyménorrhée : « Polyménorrhée : votre cycle de [X] jours est plus court que le repère ([24 ou 21] jours au moins[ dans les premières années]). Des règles trop rapprochées peuvent fatiguer et causer une anémie. Consultez. »
- Oligoménorrhée : « Oligoménorrhée : votre cycle de [X] jours est plus long que le repère ([38 ou 45] jours au plus[ dans les premières années]). Des cycles espacés peuvent signaler un trouble de l'ovulation (ovaires polykystiques, thyroïde, poids, stress), surtout important si vous souhaitez une grossesse. Consultez. »
- Irrégularité : « Cycles irréguliers : l'écart entre votre cycle le plus court et le plus long dépasse [7 ou 9] jours (repère à votre âge : [7 ou 9] jours au plus). Consultez. »
- Adolescente : « Vos règles ont commencé il y a moins de 3 ans : à cette période, des cycles un peu irréguliers sont fréquents. Consultez si les règles restent absentes plus de 3 mois, ou si elles reviennent plus souvent que toutes les 3 semaines. »
- Régularité inconnue : « Pour juger la régularité, notez pendant quelques mois la date du premier jour de vos règles (sur un calendrier ou dans votre téléphone). »
- Métrorragies : « Métrorragies : des saignements entre les règles doivent être examinés. Consultez. »
- Hypoménorrhée : « Hypoménorrhée : règles très peu abondantes. Souvent sans gravité, mais parlez-en si c'est un changement récent ou si vous souhaitez une grossesse. »
- Sous contraception hormonale ou allaitement (à la place des 5 messages précédents) : « Sous [méthode], des saignements irréguliers, plus rares, très légers ou entre les règles sont fréquents, surtout les premiers mois. Consultez s'ils durent plus de 3 mois après le début de la méthode, s'ils changent brusquement, ou s'ils s'accompagnent de douleurs ou de saignements après les rapports. » (variante « Pendant l'allaitement, des… »)
- Règles prolongées : « Règles prolongées : [X] jours de saignement, au-delà du repère de 8 jours. Consultez. »
- Règles abondantes : « Règles probablement trop abondantes (hyperménorrhée) : [indices]. Le nombre de garnitures n'est qu'un indice, mais ces signes suffisent à justifier un avis. Des règles trop abondantes peuvent provoquer une anémie (fatigue, essoufflement, vertiges). L'examen, l'échographie et une numération sanguine permettent d'en trouver la cause (fibrome, polype, trouble hormonal ou de la coagulation) et de la traiter. » + stérilet au cuivre : « Le stérilet au cuivre peut rendre les règles plus abondantes : signalez-le. »
- Après les rapports : « Saignements après les rapports : le col de l'utérus doit être examiné (infection, polype, lésion du col). Faites aussi le dépistage du cancer du col s'il n'est pas à jour. »
- Douleur invalidante : « Dysménorrhée invalidante : la douleur vous empêche de vivre normalement. Avoir aussi mal n'est pas « normal » : des traitements efficaces existent. »
- Douleur légère ou modérée : « Dysménorrhée [légère / modérée] : des règles un peu douloureuses sont fréquentes. Chaleur sur le ventre, activité physique et un antidouleur (par exemple l'ibuprofène, si vous le tolérez) soulagent souvent. Consultez si la douleur augmente. »
- Douleur longue : « Douleur sur [X] jours : une douleur de règles habituelle dure 1 à 3 jours. Une douleur plus longue est à signaler au médecin. »
- Signes à explorer : « Ces signes ne permettent pas de poser un diagnostic, mais ils justifient de rechercher une endométriose, une infection ou une autre cause : [liste]. » + cuivre : « Le stérilet au cuivre peut aussi rendre les règles plus douloureuses. »
- Rien d'anormal : « D'après vos réponses, vos règles correspondent aux repères d'un cycle normal[ pour les premières années après les premières règles]. »

**Tableau « Les repères médicaux »** : 16 lignes (cycle normal, polyménorrhée, oligoménorrhée, cycles irréguliers, aménorrhée primaire, aménorrhée secondaire, absence de règles de l'allaitement, saignements modifiés par la contraception, ménopause, règles prolongées, hyperménorrhée, hypoménorrhée, métrorragies, saignements après les rapports, dysménorrhée, dysménorrhée invalidante). Les lignes qui concernent la personne sont surlignées en jaune avec « ◀ vous ». Définitions : voir `DEF` dans le script de `regles.html`.

**Fiche pour la consultation** (à l'écran et à l'impression) : tableau des réponses, niveau d'orientation, « Questions à poser au médecin » choisies selon les résultats (par exemple « Ai-je une anémie ? Faut-il une numération sanguine ? », « Une endométriose est-elle possible ? Quels examens la recherchent ? », « Mon dépistage du cancer du col est-il à jour ? »), et « À apporter » (dates des règles des 3 à 6 derniers mois, médicaments et contraception, derniers résultats).

**Mention** : « **Information générale. Ne remplace pas une consultation.** Cet outil oriente, il ne pose pas de diagnostic : seul un examen permet de trouver la cause d'un trouble des règles. Consultez en urgence en cas de saignement très abondant, de malaise, ou de saignement ou de forte douleur alors qu'une grossesse est possible. »

**Message WhatsApp** (bouton « Demander un avis (WhatsApp) ») : « Bonjour CMS HOSANNA, je viens de l'outil « Mes règles sont-elles normales ? » du site HOSANNA. Je souhaiterais un avis sur mes règles. Résultat de l'outil : [résumé]. »

## 6. Exemples de contrôle (vérifiés par test automatique)

| Saisie | Résultat attendu |
|---|---|
| 25 ans, cycle 28 j, règles 5 j, 4 garnitures | Cycle normal, vert |
| Cycle 21 j | Polyménorrhée, orange (1 mois) |
| Cycle 38 j | Cycle normal (limite) |
| Cycle 42 j, écart 10 j ou plus | Oligoménorrhée + cycles irréguliers |
| 30 ans, écart 8-9 j / 22 ans, écart 8-9 j | irrégulier / normal |
| 14 ans, premières règles à 12 ans, cycle 42 j, irrégulier | Cycle normal (repère 21-45 j), message adolescente |
| 14 ans, premières règles à 12 ans, cycle 50 j | Oligoménorrhée |
| Règles 10 j, 8 garnitures | Règles prolongées + hyperménorrhée, orange (2 semaines) |
| 3 garnitures / 4 garnitures / caillots seuls | normal / hyperménorrhée / hyperménorrhée |
| Adulte, règles de 8 j / adolescente (règles depuis 2 ans), 8 j | normal / règles prolongées (repère 7 j) |
| Très peu abondantes | Hypoménorrhée, vert |
| Saignements entre les règles et après les rapports | Métrorragies + saignements après les rapports, orange (2 semaines) |
| Implant, cycle 45 j, saignements entre les règles | Saignements modifiés par la contraception, vert |
| Implant + saignements après les rapports | reste orange (2 semaines) |
| Stérilet au cuivre, 9 garnitures | Hyperménorrhée, mention du cuivre |
| Douleur légère | Dysménorrhée, vert |
| Douleur modérée apparue tardivement / douleur hors règles | signes à explorer, orange (1 mois) |
| Douleur forte 5 jours, antidouleurs inefficaces, douleur aux rapports | Dysménorrhée invalidante + signes à explorer |
| 10 garnitures + malaise | Rouge |
| Saignements entre les règles + grossesse possible (y compris sous implant) | Rouge |
| Grossesse possible sans saignement | pas d'urgence |
| Arrêt 4 mois, cycles réguliers avant / irréguliers avant | Aménorrhée secondaire / retard de règles |
| Injection, 8 mois sans règles | Saignements modifiés par la contraception, vert |
| Allaitement, 7 mois sans règles | Absence de règles de l'allaitement, rappel MAMA |
| 52 ans, 14 mois sans règles / + saignement réapparu | Ménopause, vert / métrorragies, orange (2 semaines) |
| Arrêt 2 mois + grossesse possible | test de grossesse conseillé, pas d'urgence |
| Jamais de règles à 16 ans / à 13 ans | Aménorrhée primaire / peut être normal |

## 7. Décisions de Gilbert (21/11/2026) et questions restantes

1. ~~Seuil de garnitures~~ : **4 garnitures ou plus par 24 h** au jour le plus abondant = règles abondantes (1 à 3 est l'usage habituel).
2. ~~Pièce de 100 F CFA~~ : **gardée.**
3. ~~Délais de consultation~~ : **gardés** (orange 2 semaines ou 1 mois, rouge maintenant).
4. ~~Contraception hormonale~~ : **gardée en vert**, avec les conditions affichées. *Réponse de Gilbert comprise comme un accord (« Accord, je pense que c'est mieux ») : à confirmer d'un mot.*
5. ~~Adolescentes~~ : « prendre ce qui est proche de nous » → **règles prolongées au-delà de 7 jours** pendant les 3 premières années (repère des manuels francophones, identique à l'ACOG) ; cycles de 21 à 45 jours.
6. ~~Mesure d'audience~~ : laissée à l'appréciation de Claude → **retirée de cette page** (cohérent avec « aucune donnée n'est envoyée »).
7. ~~Terminologie~~ (22/11) : **définition actuelle FIGO 2018 retenue** : cycles de moins de 24 jours = trop fréquents, plus de 38 jours = trop espacés. L'ancienne définition française (< 21 jours) n'est pas utilisée. Justification : c'est la terminologie internationale de référence la plus récente (FIGO 2018) [1]. *À vérifier : que les RPC du CNGOF 2022 [4] reprennent bien cette terminologie (non contrôlé pendant ce travail).*
8. ~~Âges limites~~ (22/11, décision laissée à Claude) : **9 à 60 ans gardés**, avec un message d'orientation au lieu d'une simple erreur : avant 9 ans « Cet outil s'adresse aux filles et aux femmes de 9 à 60 ans. Avant 9 ans, des saignements ou des règles sont trop précoces : montrez l'enfant à un médecin. » ; après 60 ans « Cet outil s'adresse aux femmes de 9 à 60 ans. Après 60 ans, tout saignement par le vagin doit être examiné rapidement par un médecin : consultez. »
9. Restent ouvertes, pour plus tard : 9 et 60 ans ; saignement sous traitement hormonal de la ménopause ; version en éwé ou en mina plus tard.


## 8. Mise en ligne (22/11/2026)

- Bandeau « en attente de validation » retiré ; page en `noindex` ; hors sitemap et `llms.txt` (indexation après relecture finale de Gilbert).
- Ton neutre (décision de Gilbert, 22/11) : bouton « Demander un avis (WhatsApp) » ; phrase de fin « Pour un avis adapté à votre situation, faites-vous consulter par un professionnel de santé. Si vous le souhaitez, l'équipe du CMS HOSANNA peut aussi vous répondre. » ; même phrase sur la fiche imprimée, suivie des coordonnées du centre ; aucune mention d'argent ni de tarif.
- Compteur anonyme : `regles_resultat`, `imprimer_clic`, `rdv_whatsapp_clic`. Le message WhatsApp commence automatiquement par l'origine (« je viens de l'outil … du site HOSANNA »).
- Pour activer l'indexation : passer `noindex` en `index, follow`, ajouter la page à `sitemap.xml` et à `llms.txt`.

**Indexation (25/11) :** accord de Gilbert DOGBAN transmis par l'Orchestrateur. Page passée en `index, follow` et ajoutée au sitemap, pour la mise en ligne du 5/12.
