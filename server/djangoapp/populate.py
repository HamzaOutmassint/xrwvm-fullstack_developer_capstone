from .models import CarMake, CarModel


def initiate():
    car_make_data = [
        {"name": "NISSAN", "description": "Great cars. Japanese technology"},
        {"name": "Mercedes", "description": "Great cars. German technology"},
        {"name": "Audi", "description": "Great cars. German technology"},
        {"name": "Kia", "description": "Great cars. Korean technology"},
        {"name": "Toyota", "description": "Great cars. Japanese technology"},
    ]

    car_make_instances = [
        CarMake.objects.create(**data)
        for data in car_make_data
    ]

    car_model_data = [
        ("Pathfinder", "SUV", 2023, 0, 1),
        ("Qashqai", "SUV", 2023, 0, 1),
        ("XTRAIL", "SUV", 2023, 0, 1),
        ("A-Class", "SUV", 2023, 1, 2),
        ("C-Class", "SUV", 2023, 1, 2),
        ("E-Class", "SUV", 2023, 1, 2),
        ("A4", "SUV", 2023, 2, 3),
        ("A5", "SUV", 2023, 2, 3),
        ("A6", "SUV", 2023, 2, 3),
        ("Sorrento", "SUV", 2023, 3, 4),
        ("Carnival", "SUV", 2023, 3, 4),
        ("Cerato", "Sedan", 2023, 3, 4),
        ("Corolla", "Sedan", 2023, 4, 5),
        ("Camry", "Sedan", 2023, 4, 5),
        ("Kluger", "SUV", 2023, 4, 5),
    ]

    for name, car_type, year, make_index, dealer_id in car_model_data:
        CarModel.objects.create(
            name=name,
            type=car_type,
            year=year,
            car_make=car_make_instances[make_index],
            dealer_id=dealer_id,
        )
        
