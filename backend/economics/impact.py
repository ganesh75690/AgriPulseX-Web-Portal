def calculate_impact(data: dict):
    radius = data.get("radius_km", 3)

    farms_affected = radius * 250
    income_loss = farms_affected * 15000
    income_saved = income_loss * 0.65

    return {
        "farms_affected": farms_affected,
        "income_affected": income_loss,
        "income_saved": int(income_saved)
    }