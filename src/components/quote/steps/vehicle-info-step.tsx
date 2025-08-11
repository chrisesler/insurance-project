'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useQuote } from '@/lib/providers/quote-context';
import { VehicleInfo, VehicleMake, VehicleModel } from '@/types';
import { VehicleService } from '@/lib/services/vehicle-service';

const vehicleInfoSchema = z.object({
  vehicleYear: z.number().min(1990, 'Vehicle must be from 1990 or later'),
  vehicleMake: z.string().min(1, 'Please select a vehicle make'),
  vehicleModel: z.string().min(1, 'Please select a vehicle model'),
  vin: z.string().length(17, 'VIN must be exactly 17 characters').optional().or(z.literal('')),
});

export function VehicleInfoStep() {
  const { state, updateData, nextStep, prevStep } = useQuote();
  const [makes, setMakes] = useState<VehicleMake[]>([]);
  const [models, setModels] = useState<VehicleModel[]>([]);
  const [loadingMakes, setLoadingMakes] = useState(true);
  const [loadingModels, setLoadingModels] = useState(false);

  const form = useForm<VehicleInfo>({
    resolver: zodResolver(vehicleInfoSchema),
    defaultValues: {
      vehicleYear: state.vehicleYear || new Date().getFullYear(),
      vehicleMake: state.vehicleMake || '',
      vehicleModel: state.vehicleModel || '',
      vin: state.vin || '',
    },
  });

  const selectedMake = form.watch('vehicleMake');
  const selectedYear = form.watch('vehicleYear');

  useEffect(() => {
    const loadMakes = async () => {
      try {
        // This now returns instantly with popular makes
        const vehicleMakes = await VehicleService.getVehicleMakes();
        setMakes(vehicleMakes);
        setLoadingMakes(false);
      } catch (error) {
        console.error('Failed to load vehicle makes:', error);
        setLoadingMakes(false);
      }
    };
    loadMakes();
  }, []);

  useEffect(() => {
    if (selectedMake) {
      const loadModels = async () => {
        setLoadingModels(true);
        try {
          const selectedMakeData = makes.find(make => make.Make_Name === selectedMake);
          if (selectedMakeData) {
            const vehicleModels = await VehicleService.getModelsForMake(
              selectedMakeData.Make_ID, 
              selectedYear
            );
            setModels(vehicleModels);
          }
        } catch (error) {
          console.error('Failed to load vehicle models:', error);
        } finally {
          setLoadingModels(false);
        }
      };
      loadModels();
      form.setValue('vehicleModel', ''); // Reset model when make changes
    }
  }, [selectedMake, selectedYear, makes, form]);

  const onSubmit = (data: VehicleInfo) => {
    updateData(data);
    nextStep();
  };

  const vehicleYears = VehicleService.getVehicleYears();

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold mb-2">Vehicle Information</h2>
        <p className="text-muted-foreground">
          Tell us about the vehicle you want to insure.
        </p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
            <FormField
              control={form.control}
              name="vehicleYear"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormLabel>Year</FormLabel>
                  <Select
                    onValueChange={(value) => field.onChange(parseInt(value))} 
                    defaultValue={field.value?.toString()}
                  >
                    <FormControl>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select year" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {vehicleYears.map((year) => (
                        <SelectItem key={year} value={year.toString()}>
                          {year}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="vehicleMake"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Make</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder={loadingMakes ? "Loading..." : "Select make"} />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {makes.map((make) => (
                        <SelectItem key={make.Make_ID} value={make.Make_Name}>
                          {make.Make_Name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="vehicleModel"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Model</FormLabel>
                  <Select 
                    onValueChange={field.onChange} 
                    defaultValue={field.value}
                    disabled={!selectedMake || loadingModels}
                  >
                    <FormControl>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder={
                          !selectedMake 
                            ? "Select make first" 
                            : loadingModels 
                              ? "Loading models..." 
                              : "Select model"
                        } />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {models.map((model, index) => (
                        <SelectItem key={`${model.Model_ID}-${model.Model_Name}-${index}`} value={model.Model_Name}>
                          {model.Model_Name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="vin"
            render={({ field }) => (
              <FormItem>
                <FormLabel>VIN (Optional)</FormLabel>
                <FormControl>
                  <Input 
                    placeholder="17-character Vehicle Identification Number" 
                    maxLength={17}
                    {...field} 
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="flex justify-between pt-4">
            <Button type="button" variant="outline" onClick={prevStep}>
              Back
            </Button>
            <Button type="submit" size="lg">
              Next: Coverage Options
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}