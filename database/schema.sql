-- SmartClinic MySQL Database Schema

-- Users table supporting all three roles: Patient, Doctor, Admin
CREATE TABLE Users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    role ENUM('patient', 'doctor', 'admin') NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Doctor Profiles (Extension of Users table)
CREATE TABLE Doctor_Profiles (
    user_id INT PRIMARY KEY,
    specialty VARCHAR(255) NOT NULL,
    language VARCHAR(100) DEFAULT 'English',
    gender ENUM('male', 'female', 'other') NOT NULL,
    consultation_fee DECIMAL(10,2) DEFAULT 0.00,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES Users(id) ON DELETE CASCADE
);

-- Medical History (For Patients)
CREATE TABLE Medical_History (
    id INT AUTO_INCREMENT PRIMARY KEY,
    patient_id INT NOT NULL,
    doctor_id INT NOT NULL,
    diagnosis TEXT,
    prescription TEXT,
    allergies TEXT,
    visit_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (patient_id) REFERENCES Users(id) ON DELETE CASCADE,
    FOREIGN KEY (doctor_id) REFERENCES Users(id) ON DELETE CASCADE
);

-- Calendar Slots for Doctors
CREATE TABLE Slots (
    id INT AUTO_INCREMENT PRIMARY KEY,
    doctor_id INT NOT NULL,
    start_time DATETIME NOT NULL,
    end_time DATETIME NOT NULL,
    status ENUM('available', 'locked', 'booked', 'unavailable') DEFAULT 'available',
    locked_until DATETIME DEFAULT NULL, -- Soft lock mechanism (3 minutes)
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (doctor_id) REFERENCES Users(id) ON DELETE CASCADE
);

-- Appointments 
CREATE TABLE Appointments (
    id INT AUTO_INCREMENT PRIMARY KEY,
    slot_id INT NOT NULL UNIQUE,
    patient_id INT NOT NULL,
    doctor_id INT NOT NULL,
    status ENUM('confirmed', 'cancelled', 'completed') DEFAULT 'confirmed',
    cancellation_reason VARCHAR(255) DEFAULT NULL,
    cancellation_role ENUM('patient', 'doctor', 'admin') DEFAULT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (slot_id) REFERENCES Slots(id) ON DELETE CASCADE,
    FOREIGN KEY (patient_id) REFERENCES Users(id) ON DELETE CASCADE,
    FOREIGN KEY (doctor_id) REFERENCES Users(id) ON DELETE CASCADE
);

-- Leave Requests for Doctors
CREATE TABLE Leave_Requests (
    id INT AUTO_INCREMENT PRIMARY KEY,
    doctor_id INT NOT NULL,
    start_date DATETIME NOT NULL,
    end_date DATETIME NOT NULL,
    reason TEXT NOT NULL,
    status ENUM('pending', 'approved', 'rejected') DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (doctor_id) REFERENCES Users(id) ON DELETE CASCADE
);

-- Substitution Board (for Uncovered appointments)
CREATE TABLE Substitution_Board (
    id INT AUTO_INCREMENT PRIMARY KEY,
    appointment_id INT NOT NULL,
    original_doctor_id INT NOT NULL,
    status ENUM('open', 'covered') DEFAULT 'open',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (appointment_id) REFERENCES Appointments(id) ON DELETE CASCADE,
    FOREIGN KEY (original_doctor_id) REFERENCES Users(id) ON DELETE CASCADE
);
