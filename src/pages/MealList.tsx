import React, { useEffect } from "react";
import {
  useDataGrid,
  DataGrid,
  GridColumns,
  EditButton,
  ShowButton,
  List,
  MarkdownField,
  Chip,
  GridValueGetterParams,
} from "@pankod/refine-mui";
import { useMany } from "@pankod/refine-core";
import { Ingredient, Meal, Option } from "../types";

export const MealList = () => {
  const { dataGridProps } = useDataGrid({
    hasPagination: false,
  });

  const { data: mergedMealList, isLoading: mergedMealListIsLoading } =
    useMany<Meal>({
      resource: "get",
      ids: dataGridProps.rows.map((value) => value.id),
    });

  // console.log(mergedMealList && "mergedMealList: ", mergedMealList);

  function priceRangeCalculator(params: GridValueGetterParams) {
    let highestPrice = 0;
    let lowestPrice = 0;
    // @ts-ignore
    mergedMealList?.data
      .find((meal: Meal) => meal.id === params.row.id)
      .ingredients.map((ingredient: Ingredient) => {
        const highLevelPrice = ingredient.options.find(
          (option: Option) => option.quality === "high"
        );
        highestPrice =
          (ingredient.quantity / 1000) *
          (highLevelPrice ? highLevelPrice.price : 1);

        const lowLevelPrice = ingredient.options.find(
          (option: Option) => option.quality === "low"
        );
        lowestPrice =
          (ingredient.quantity / 1000) *
            (lowLevelPrice ? lowLevelPrice.price : 1) +
          0.1;
      });

    return `${lowestPrice.toFixed(2)} - ${highestPrice.toFixed(2)}`;
  }

  const columns = React.useMemo<GridColumns<any>>(
    () => [
      {
        field: "id",
        headerName: "Id",
        type: "number",
        minWidth: 50,
      },
      {
        field: "name",
        headerName: "Name",
        minWidth: 200,
      },
      {
        field: "ingredients",
        headerName: "Ingredients",
        minWidth: 300,
        renderCell: function render({ value }) {
          return mergedMealListIsLoading ? (
            <>Loading...</>
          ) : (
            value.map((ingredient: Ingredient) => (
              <Chip key={ingredient.name} label={ingredient.name} />
            ))
          );
        },
      },
      {
        field: "price",
        headerName: "Price",
        type: "number",
        minWidth: 200,
        valueGetter: ({ row }) => {
          let highestPrice = 0;
          let lowestPrice = 0;

          const rowMeal = mergedMealList?.data.find(
            (meal: Meal) => meal.id === row.id
          );

          console.log("rowMeal: ", row);

          rowMeal?.ingredients.map((ingredient: Ingredient) => {
            const highLevelPrice = ingredient.options.find(
              (option: Option) => option.quality === "high"
            );
            highestPrice +=
              (ingredient.quantity / 1000) *
              (highLevelPrice ? highLevelPrice.price : 1);

            const lowLevelPrice = ingredient.options.find(
              (option: Option) => option.quality === "low"
            );
            lowestPrice +=
              (ingredient.quantity / 1000) *
                (lowLevelPrice ? lowLevelPrice.price : 1) +
              0.1;
          });

          return `${lowestPrice.toFixed(2)} - ${highestPrice.toFixed(2)}`;
        },
        renderCell: function render({ value }) {
          return mergedMealListIsLoading ? <>Loading...</> : value;
        },
      },
      {
        field: "actions",
        headerName: "Actions",
        renderCell: function render({ row }) {
          return (
            <>
              <ShowButton hideText recordItemId={row.id} />
            </>
          );
        },
        align: "center",
        headerAlign: "center",
        minWidth: 80,
      },
    ],
    [mergedMealListIsLoading]
  );

  return (
    <List title="Meal List">
      <DataGrid
        {...dataGridProps}
        filterMode="client"
        sortingMode="client"
        columns={columns}
        disableColumnFilter
        initialState={{
          sorting: {
            sortModel: [{ field: "name", sort: "desc" }],
          },
        }}
        autoHeight
      />
    </List>
  );
};
