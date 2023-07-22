# Allgemein
Das Projekt wird auf der Webseite [wpf.gweiermann.de](https://wpf.gweiermann.de) gehostet. 

# Daten auf der Webseite anpassen
Informationen, die auf der Webseite angezeigt werden, sind im GitHub [hier](https://github.com/codinghusi/wahlmodule/tree/main/data) zu finden.
Du kannst dort bspw. neue Module hinzufügen und einen Pull Request starten.

## Wahlmodul hinzufügen/bearbeiten
Unter [./modules](https://github.com/codinghusi/wahlmodule/tree/main/data/modules) gibt es pro Wahlmodul ein Ordner.
Zur Konvention ist der Name der Ordner nach dem Kürzel des Wahlmoduls benannt. Die Bennung hat jedoch keinen Einfluss auf die Darstellung des Moduls.
Eine spätere Änderung des Namens könnte ggf. problematisch werden (hier ist noch Verbesserungsbedarf im Update-Skript).

Im Ordner befinden sich die Dateien "description.md" und "metadata.json".
### description.md
Hier steht die Modulbeschreibung in Markdown.

### metadata.json
Hier stehen die restlichen Informationen zum Wahlmodul. Es werden die folgenden Eigenschaften unterstützt:

`short`  
Das Kürzel des Moduls. Das ist die ID in der Datenbank. Eine spätere Änderung wird nur mäßig unterstützt. 

`name`  
Der ausgeschriebene Name des Moduls, der dargestellt wird

`dependencies`  
Eine Liste an Modulen, die vorausgesetzt werden. Die Einträge der Liste sind jeweils die Kürzel der Module (short)

`focuses`
Die Schwerpunkte des Moduls als Liste. Einträge sind die Namen der Schwerpunkte, die unter [focuses.json](https://github.com/codinghusi/wahlmodule/blob/main/data/other/focuses.json) definiert wurden

`seasons`  
Es werden die folgenden Werte unterstützt (als Liste, sodass beide Semester möglich sind):
* "SS" für Sommersemester
* "WS" für Wintersemester

`lecturers`  
Die Dozenten des Moduls. Als Liste der Kürzel der Dozenten. Diese müssen in der [lecturers.json](https://github.com/codinghusi/wahlmodule/blob/main/data/other/lecturers.json) definiert sein.


# Hosting
## Daten-Repository
Die Modulbeschreibungen und Ähnliches werden in einem Daten-Repository gehostet. Als Vorlage dient dafür ...  
Es muss ein GitLab-Repository sein. Dies muss in der .env Datei hinterlegt werden.

## Konfiguration
Erstellen der .env Datei. Als Vorlage dient dafür die env-template.txt

## Daten auf dem Server aktualisieren
```bash
npm run update
```

## Installieren
```bash
npm install
npx prisma db push
npm run update
npm run build
```