# Volunteered Geographic Information

Proposed by Goodchild

## OSM Mapping

### OSM Disaster Mapping

- Humanitarian OpenStreetMap Team (HOT) involved in mapping activities after the earthquakes in Haiti 2010, Haiyan 2013 and Nepal 2015, which provided a large amount of data within a short time. A system has been developed to monitor and understand the OSM disaster mapping and data quality by analyzing the edit history \cite{Auer2018}.

*Auer, M., Eckle, M., Fendrich, S., Griesbaum, L., Kowatsch, F.,Marx, S., Raifer, M., Schott, M. and Troilo, R., 2018.  TowardsUsing the Potential of OpenStreetMap History for Disaster Acti-vation Monitoring. In:Proceedings of the 15th ISCRAM Confer-ence Rochester, NY, USA May 2018, pp. 317–325.*

## Flood Monitoring - Analysis

Crowdsourcing often used for disaster monitoring such as earthquake, flood, or forest fires.

### Flood in Brazil : Crowdsensing + weather radar precipitation (2018)

- Good argument: Public organizations that monitoring flooding areas unusually have limited capability of reach and resource to be in all places needed. Application: validate flood area identified by VGI. Approach: 1. Filtering with collaborative platform (mobile app, 735 georeferenced reports) 2. Spatial Clustering(KDE) 3. analyze and validate using weather radar (rainfall)

*Horita, F. E. A., Vilela, R. B., Martins, R. G., Bressiani, D. A.,Palma, G. and de Albuquerque, J. P., 2018.  Determining floodedareas using crowd sensing data and weather radar precipitation:  a case study in Brazil.   In:Proceedings of the 15th ISCRAMConference Rochester, NY, USA May 2018, pp. 1040–1050.*

## Disaster Monitoring - Retrieval

2017 MediaEval test.


## General Disaster Monitoring - NLP Methods

### Disaster Hashtags (2017)
 
Compare keyword based method and their own approach. SVM (rbf) and sLDA (supervised, k=100) were used for training a binary classifier based on balanced dataset (2x36k) with R packages.

Dataset: [crisislex](http://crisislex.org/) 
 
*Murzintcev, N., & Cheng, C. (2017). Disaster Hashtags in Social Media. ISPRS International Journal of Geo-Information, 6(7), 204.*


## Other VGI Applications

### Tracking the migration patterns of refugee in 2015

- hashtag based topical clusering, **density based st-event clustering** (OPTICS 10km + one day + 3 pts + distance function) and **distance bounded st-event clustering** (10km + max 5 pts). Posts without explicit coordinate, bounding box < 15.000km^2.

*Hübl, F., Cvetojevic, S., Hochmair, H., & Paulus, G. (2017). Analyzing Refugee Migration Patterns Using Geo-tagged Tweets. ISPRS International Journal of Geo-Information, 6(10), 302.*

**Distance bounded st-event clustering**: 

*Andrienko, N., Andrienko, G., Fuchs, G., Rinzivillo, S., & Betz, H. D. (2015, October). Detection, tracking, and visualization of spatial event clusters for real time monitoring. In Data Science and Advanced Analytics (DSAA), 2015. 36678 2015. IEEE International Conference on (pp. 1-10). IEEE.* 

*Gennady Andrienko, Natalia Andrienko, Wei Chen, Ross Maciejewski, Ye Zhao, "Visual Analytics of Mobility and Transportation: State of the Art and Further Research Directions", Intelligent Transportation Systems IEEE Transactions on, vol. 18, pp. 2232-2249, 2017, ISSN 1524-9050.*

### Paris attack in November 2015

- Kernel-density, using exploratory methods and regression models

*Cvetojevic, S., & Hochmair, H. H. (2018). Analyzing the spread of tweets in response to Paris attacks. Computers, Environment and Urban Systems.*


## Thinkings:

Most of the research has generally three steps:

1. Data Acqusition (Tweepy, Mobile App)
2. Filtering (Hashtag, IR, Multi IR)
3. Analyses (ST-Clustering)

# Quality 

### Quality Assessment for VGI/CGI

11 Methods were summarized

| ID   | Method | Description | Primary Studies | Remarks for social media VGI |
| :--- | :----- | :---------- | :-------------- | :------- |
| M1 | Geographic context | Investigating the area surrounding the location of CGI to determine its geographical features and employ them to assess the quality of CGI. | Senaratne et al. (2013); Zielstra & Hochmair (2013) |  |
| M2	| Redundancy of volunteers' contribution	|Requesting several volunteers to provide information about the same geographic feature to find out if or not there is a convergence of the information produced by different volunteers.	|Comber et al. (2013); Foody (2014); See et al. (2013)|  |
| M3	| Scoring volunteered contribution	|Asking volunteers to rate every piece of CGI that is contributed by other volunteers.	|Lertnattee et al. (2010)| *It requires a large number of raters to achieve truth representation - Impratical* |
| M4	| Expert assessment	|Submitting CGI to experts who are responsible for checking the information content and correcting it if necessary.	|Foody et al. (2013); Karam & Melchiori (2013)| *It requires a large number of experts - impractical* |
| M5	| Automatic location checking	|Estimating the quality of CGI by the distance between geocoded coordinates, obtained from multiple geocoding services, and the location (i.e., an address) provided by the volunteer.	|Cui (2013)|  |
| M6	| Spatiotemporal clustering	|Creating spatiotemporal clusters of CGI elements using prior information about a phenomenon of interest and, later, evaluating the significance of the resulting clusters for a specific purpose.	|Longueville et al. (2010)|  *ST-Clustering can help reject outliers* |
| M7	| Volunteer's profile; reputation	|Analyzing volunteer's profile or reputation and using it to estimate the quality of CGI.	|Bishr & Janowicz (2010); Bishr & Kuhn (2013); Bodnar et al. (2014)| *The profile of the users hardly provide enough information about users' reputation to the desired problem* |
| M8	|Error detection /correct by crowd	|Several volunteers acting as gatekeepers and, thus, correcting errors introduced by other volunteers.	|Haklay et al. (2010)|  |
| M9	|Extracting/learning of characteristics	|Extracting characteristics from each type of geographic feature, learning the information implicit in them and, later, using the information to estimate the quality of CGI.	|Ali & Schmid (2014); Jilani & Corcoran (2014); Mohammadi & Malek (2015)|  |
| M10	|Ranking/filtering by linguistic terms	|Evaluate CGI items based on different criteria that are expressed linguistically, rank them in degrees of criteria satisfaction and, later, filter them based on the constraints of the application domain.	|Bordogna et al. (2014)|  |
| M11	|Historical data analysis	|Deriving (intrinsic) indicators from the history of the data and, later, using them to make statements regarding the quality of CGI.	|Keßler & de Groot (2013)|  |


*Degrossi, L. C., Porto de Albuquerque, J., Santos Rocha, R. D., & Zipf, A. (2018). A taxonomy of quality assessment methods for volunteered and crowdsourced geographic information. Transactions in GIS, 22(2), 542-560.*
