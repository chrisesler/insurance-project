'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useQuote } from '@/lib/providers/quote-context';
import { CoverageInfo } from '@/types';
import { COVERAGE_OPTIONS, LIABILITY_LIMITS, DEDUCTIBLE_OPTIONS } from '@/lib/services/quote-service';
import { CheckCircle } from 'lucide-react';

const coverageSchema = z.object({
  coverageType: z.enum(['LIABILITY', 'STANDARD', 'FULL']),
  liabilityLimit: z.number().min(25000, 'Minimum liability limit is $25,000'),
  deductible: z.number().min(250, 'Minimum deductible is $250'),
});

export function CoverageStep() {
  const { state, updateData, nextStep, prevStep } = useQuote();

  const form = useForm<CoverageInfo>({
    resolver: zodResolver(coverageSchema),
    defaultValues: {
      coverageType: (state.coverageType as 'LIABILITY' | 'STANDARD' | 'FULL') || 'STANDARD',
      liabilityLimit: state.liabilityLimit || 100000,
      deductible: state.deductible || 1000,
    },
  });

  const selectedCoverageType = form.watch('coverageType');

  const onSubmit = (data: CoverageInfo) => {
    updateData(data);
    nextStep();
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold mb-2">Coverage Options</h2>
        <p className="text-muted-foreground">
          Choose the level of protection that's right for you.
        </p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          {/* Coverage Type Selection */}
          <FormField
            control={form.control}
            name="coverageType"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-base font-semibold">Coverage Type</FormLabel>
                <FormControl>
                  <RadioGroup 
                    value={field.value} 
                    onValueChange={field.onChange}
                    className="grid gap-4 mt-3"
                  >
                    {Object.entries(COVERAGE_OPTIONS).map(([key, option]) => (
                      <div key={key} className="relative">
                        <label
                          htmlFor={key}
                          className="cursor-pointer"
                        >
                          <Card className={`cursor-pointer transition-all hover:border-gray-300 ${
                            field.value === key 
                              ? 'bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200 ring-2 ring-blue-500' 
                              : 'border-gray-200'
                          }`}>
                            <CardHeader className="pb-3">
                              <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-3">
                                  <RadioGroupItem 
                                    value={key} 
                                    id={key}
                                    className="border-2 border-gray-400"
                                  />
                                  <CardTitle className="text-lg">{option.name}</CardTitle>
                                </div>
                                {key === 'STANDARD' && (
                                  <Badge variant="secondary">Recommended</Badge>
                                )}
                              </div>
                              <CardDescription className="text-sm">
                                {option.description}
                              </CardDescription>
                            </CardHeader>
                            <CardContent className="pt-0">
                              <ul className="space-y-1 text-sm text-muted-foreground">
                                {option.features.map((feature, index) => (
                                  <li key={index} className="flex items-center space-x-2">
                                    <CheckCircle className="w-3 h-3 text-green-600" />
                                    <span>{feature}</span>
                                  </li>
                                ))}
                              </ul>
                            </CardContent>
                          </Card>
                        </label>
                      </div>
                    ))}
                  </RadioGroup>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Liability Limits */}
          <FormField
            control={form.control}
            name="liabilityLimit"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Liability Coverage Limit</FormLabel>
                <Select 
                  onValueChange={(value) => field.onChange(parseInt(value))} 
                  defaultValue={field.value?.toString()}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select liability limit" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {LIABILITY_LIMITS.map((limit) => (
                      <SelectItem key={limit.value} value={limit.value.toString()}>
                        {limit.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Deductible (only for Standard and Full coverage) */}
          {(selectedCoverageType === 'STANDARD' || selectedCoverageType === 'FULL') && (
            <FormField
              control={form.control}
              name="deductible"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Deductible</FormLabel>
                  <Select 
                    onValueChange={(value) => field.onChange(parseInt(value))} 
                    defaultValue={field.value?.toString()}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select deductible" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {DEDUCTIBLE_OPTIONS.map((deductible) => (
                        <SelectItem key={deductible.value} value={deductible.value.toString()}>
                          {deductible.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <p className="text-sm text-muted-foreground mt-1">
                    Higher deductibles typically result in lower premiums
                  </p>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}

          <div className="flex justify-between pt-4">
            <Button type="button" variant="outline" onClick={prevStep}>
              Back
            </Button>
            <Button type="submit" size="lg">
              Review & Get Quote
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}