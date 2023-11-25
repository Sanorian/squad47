CREATE TABLE applications (ID INT PRIMARY KEY AUTO_INCREMENT, 
                            FIO TEXT, PassportData VARCHAR(10), 
                            RegistrationAdress VARCHAR(300), 
                            LivngAdress VARCHAR(300), 
                            IsMarried VARCHAR(9), 
                            HasChildren VARCHAR(3),  
                            WorkAdress VARCHAR(300), 
                            WorkTimeInMonths INT, 
                            WorkName VARCHAR(300), 
                            Salary Float(24), 
                            SalaryDocument VARCHAR(150), 
                            AdditionalIncome Float(24), 
                            AdditionalIncomeDocument VARCHAR(150), 
                            FromAdditionalIncome VARCHAR(200), 
                            HasMoney VARCHAR(3),
                            Moderated VARCHAR(3),
                            Verdict VARCHAR(10),
                            Moderartor VARCHAR(5)
                            );

CREATE TABLE users (ID INT PRIMARY KEY AUTO_INCREMENT, username VARCHAR(50), password VARCHAR(50));