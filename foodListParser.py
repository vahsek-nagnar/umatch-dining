import csv
import ast
import json

class Food:
    def __init__(self, name, ingredients, calories, calfat, totalfat, satfat, trans, cholesterol, sodium, carb, fiber, sugar, protein, totalRatings=0, numReviews=0):
        self.name = name
        self.ingredients = ingredients
        self.calories = calories
        self.calfat = calfat
        self.totalfat = totalfat
        self.satfat = satfat
        self.trans = trans
        self.cholesterol = cholesterol
        self.sodium = sodium
        self.carb = carb
        self.fiber = fiber
        self.sugar = sugar
        self.protein = protein
        self.totalRatings = totalRatings
        self.numReviews = numReviews

    def to_dict(self):
        return {
            "name": self.name,
            "ingredients": self.ingredients,
            "calories": self.calories,
            "calfat": self.calfat,
            "totalfat": self.totalfat,
            "satfat": self.satfat,
            "trans": self.trans,
            "cholesterol": self.cholesterol,
            "sodium": self.sodium,
            "carb": self.carb,
            "fiber": self.fiber,
            "sugar": self.sugar,
            "protein": self.protein,
            "totalRatings": self.totalRatings,
            "numReviews": self.numReviews
        }

    @classmethod
    def from_dict(cls, data):
        return cls(
            data["name"],
            data["ingredients"],
            data["calories"],
            data["calfat"],
            data["totalfat"],
            data["satfat"],
            data["trans"],
            data["cholesterol"],
            data["sodium"],
            data["carb"],
            data["fiber"],
            data["sugar"],
            data["protein"],
            data.get("totalRatings", 0),
            data.get("numReviews", 0)
        )

def parse_csv(file_path):
    # Create a dictionary to hold the food data
    food_list = {}

    # Open and read the CSV file
    with open(file_path, 'r', newline='') as csvfile:
        reader = csv.DictReader(csvfile)

        # Iterate over each row in the CSV
        for row in reader:
            # Get the food name
            name = row['name']
            
            # Parse the ingredients list (it's a string representation of a list)
            ingredients = ast.literal_eval(row['ingredients'])

            # Convert numerical values to their appropriate types
            calories = float(row['calories'])
            calfat = float(row['calfat'])
            totalfat = float(row['totalfat'])
            satfat = float(row['satfat'])
            trans = float(row['trans'])
            cholesterol = float(row['cholesterol'])
            sodium = float(row['sodium'])
            carb = float(row['carb'])
            fiber = float(row['fiber'])
            sugar = float(row['sugar'])
            protein = float(row['protein'])

            # Create a Food object with default ratings and reviews
            food_item = Food(name, ingredients, calories, calfat, totalfat, satfat, trans, cholesterol, sodium, carb, fiber, sugar, protein)

            # Add the food object to the dictionary
            food_list[name] = food_item

    return food_list

def save_as_json(data, json_file_path):
    # Convert the dictionary to JSON and save it to a file
    with open(json_file_path, 'w') as jsonfile:
        json.dump({name: food.to_dict() for name, food in data.items()}, jsonfile, indent=4)

def load_from_json(json_file_path):
    with open(json_file_path, 'r') as jsonfile:
        data = json.load(jsonfile)
        return {name: Food.from_dict(food) for name, food in data.items()}

# Path to the CSV file
csv_file_path = 'food.csv'
# Path to save the JSON file
json_file_path = 'food_list.json'

# Parse the CSV file
food_list = parse_csv(csv_file_path)

# Save the food list as a JSON file
save_as_json(food_list, json_file_path)

# Load the food list from the JSON file
loaded_food_list = load_from_json(json_file_path)

# Example usage
if "Homemade Clam Chowder" in loaded_food_list:
    print(loaded_food_list["Homemade Clam Chowder"].calories)  # Output: 157
else:
    print("Homemade Clam Chowder not found in the list")
