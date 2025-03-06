# The Unfair Race
<img width="1392" alt="image" src="https://github.com/user-attachments/assets/2bdca92f-5efb-422d-921e-7ac598c24cc4" />
This data visualization project aims to explore the gender pay gap in the technology field in the USA. Despite all progress towards gender equality, gender pay gap is still prevalent in first-world countries like the USA. This issue is relevant for students entering the workforce, as both male and female students could be unaware of this pay inequality, with the female students
suffering from the consequences of the pay disparities.

## Research Question 
How do years of professional experience and level of education relate to the gender pay gap in the technology field in the USA?
## Dataset Used
2022 Stack Overflow Annual Developer Survey. This can be found on https://survey.stackoverflow.co/. 
## Website Interactions
1. Change **Level of Education** on the top right dropdown
2. Change **Years of Experience** by Scrolling up and down (more precision with a mouse)
  !<img width="1392" alt="image" src="https://github.com/user-attachments/assets/1e728d56-f158-45cf-b43a-870c59504ddb" />
3. Hover over **"No Data"** text for some explanation (shown when a track has no data)
   - e.g. "Unfortunately, non-binary gender make up only 2.6% of our data."
4. Press **"Learn More"** button to read the context of our visualization and project
5. Press **"Why is there a Gender Pay Gap"** button to learn more about this gender inequality topic

## Data Cleaning
1. We opened the dataset in OpenRefine and started cleaning out the questions (columns) that were not relevant to us such as : “How easy or difficult was this survey to complete?, How do you feel about the length of the survey this year?” and more.
2. We then looked at the “Country” column and only kept the rows that have “United States of America” coded.
3. We then investigated the “ConvertedCompYearly” (annual compensation in USD) column and deleted the rows with “NA” as salary. This gets rid of salaries not reported or reported as 0.
4. We then removed salaries that are larger than 1 million dollars. Some of these large salaries could be data errors, since users may have mis-selected “weekly” or “monthly” as the payout frequency resulting in large salaries. We also want to focus on the majority of the workforce in technology and not the millionaires in positions of power. The salary data looks more like a normal distribution (although still skewed) after this cleaning.
5. Finally, we deleted rows with salaries that are less than 10,000 dollars to remove the unnormal small peak at the left end of the normal distribution of our salary data, representing a few salaries reported between 1 to 9999 dollars.
6. Next, we investigated the “Gender” variable. Since gender was asked as a checkbox question in the survey, we had data that had different combinations of “Man”, “Woman”, “Non-binary, genderqueer, or gender non-conforming”, “Prefer Not to Say” and “Or, in your own words”. We first deleted those with unclear gender such as ones with only “Prefer Not to Say”, “NA”, “Or, in your own words” coded.
7. We decided to transmute all gender values that had “Non-binary, genderqueer, or gender non-conforming” in their combinations as “Non-binary, genderqueer, or gender non-conforming”. For example, “Women; Non-binary, genderqueer, or gender non-conforming” is re-coded as “Non-binary, genderqueer, or gender non-conforming” and vice versa. We made this decision since most respondents with “Non-binary, genderqueer, or gender non-conforming” in their gender combinations also had one or more of the sexualities in LGBTQ+ listed in their “Sexuality” data.
8. What remained were data combinations “Man; Or, in your own words” and “Woman; Or, in your own words” which we transmuted as “Man” and “Woman” respectively.
9. Lastly, we investigated “EdLevel” and “WorkExp” and deleted data that had “Something else” as their educational level or “NA” as years of work experience. We need both information to be present for our visualization. 

## Made By
Team Gender Queens - Vivian LI and Céline DEIVANAYAGAM
