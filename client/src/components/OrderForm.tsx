import React, { useEffect, useState } from "react";
import {
  TextField,
  Dropdown,
  Button,
  AttentionBox,
  Loader
} from "@vibe/core";

import { createOrder } from "../services/orderService";
import { fetchFragrances } from "../services/fragranceService";
import { FragranceOption, FragranceResponseDTO } from "../types/fragrance.types";
import { ORDER_LIMITS } from "../config/constants";
import "./OrderForm.css";


const OrderForm: React.FC = () => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [kitsAmount, setKitsAmount] = useState(1);
  const [fragrances, setFragrances] = useState<FragranceOption[]>([]);
  const [selectedFragrances, setSelectedFragrances] = useState<FragranceOption[]>([]);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const MAX_FRAGRANCES = ORDER_LIMITS.FRAGRANCES_PER_BOX;

  useEffect(() => {
    const load = async () => {
      try {
        const data: FragranceResponseDTO[] = await fetchFragrances();
        const mapped: FragranceOption[] = data.map((f: any) => ({
          value: f.slug,
          label: f.display_name,
        }));
        setFragrances(mapped);
      } catch {
        setError("Failed to load fragrances");
      }
    };

    load();
  }, []);

  const handleFragranceChange = (values: FragranceOption[]) => {
    if (values.length <= MAX_FRAGRANCES) {
      setSelectedFragrances(values);
    }
  };

  const handleSubmit = async () => {
    setError("");
    setSuccess("");

    if (!firstName || !lastName) {
      setError("First name and last name are required");
      return;
    }

    if (selectedFragrances.length !== MAX_FRAGRANCES) {
      setError(`Please select exactly ${MAX_FRAGRANCES} fragrances`);
      return;
    }

    try {
      setLoading(true);

      await createOrder({
        firstName,
        lastName,
        fragranceSlugs: selectedFragrances.map((f) => f.value),
        kitsAmount,
      });

      setSuccess("Order created successfully");
      setFirstName("");
      setLastName("");
      setSelectedFragrances([]);
      setKitsAmount(1);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const isFormValid =
    firstName.trim() !== "" &&
    lastName.trim() !== "" &&
    kitsAmount > 0 &&
    selectedFragrances.length === MAX_FRAGRANCES;

  return (
    <div className="order-form">
      <h2 className="order-title">Create New Candle Kit</h2>

      <p className="order-subtitle">
        Select exactly {MAX_FRAGRANCES} fragrances per kit
      </p>

      {error && (
        <AttentionBox
          type="danger"
          text={error}
          className="order-alert"
        />
      )}

      {success && (
        <AttentionBox
          type="success"
          text={success}
          className="order-alert"
        />
      )}

      <div className="form-field">
        <TextField
          title="First Name"
          value={firstName}
          onChange={setFirstName}
          required
        />
      </div>

      <div className="form-field">
        <TextField
          title="Last Name"
          value={lastName}
          onChange={setLastName}
          required
        />
      </div>

      <div className="form-field">
        <TextField
          title="Kits Amount"
          type="number"
          value={kitsAmount.toString()}
          onChange={(value) => setKitsAmount(Number(value))}
        />
      </div>

      <div className="form-field">
        <Dropdown
          className="fragrance-dropdown"
          placeholder="Select fragrances"
          options={fragrances}
          value={selectedFragrances}
          onChange={handleFragranceChange}
          multi
          searchable
          menuPlacement="bottom"
        />

        <div className="counter-text">
          {selectedFragrances.length} / {MAX_FRAGRANCES} selected
        </div>
      </div>

      <div className="form-button">
        <Button
          onClick={handleSubmit}
          disabled={!isFormValid || loading}
        >
          {loading ? <Loader size="small" /> : "Create Order"}
        </Button>
      </div>
    </div>
  );
};

export default OrderForm;

